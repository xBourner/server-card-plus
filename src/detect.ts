/*
 * Server Card Plus - Auto-Detection Engine (detect.ts)
 * ----------------------------------------------------
 * Language-robust entity matching for the Proxmox VE integration.
 * Discovers the HOST node plus every VM (qemu) and container (lxc) as an
 * individually selectable "system". Matching is done on stable entity-id
 * PREFIXES (node_ / lxc_ / qemu_, cpu, arbeitsspeicher/memory,
 * temperatur/temperature) and NOT on translated words, so a German
 * ("CPU-Auslastung") and an English ("CPU usage") install both resolve.
 */

export interface HassEntity {
  entity_id: string;
  state?: string;
  friendly_name?: string;
  attributes?: Record<string, any>;
}

export type SystemKind = "node" | "lxc" | "qemu";

export interface SystemInfo {
  key: string; // e.g. "node_pve", "lxc_adguard_100", "qemu_haos_101"
  kind: SystemKind;
  label: string; // human readable
  statusEntity?: string;
}

export interface DiskInfo {
  key: string;
  name: string;
  temperature: string | null;
  size: string | null;
  wear: string | null;
  powerOnHours: string | null;
  health: string | null;
}

export interface Mapping {
  kind: SystemKind;
  status: string | null;
  health: string | null; // system-level health (guest *_gesundheit, or null for node)
  cpu: string | null;
  ram: { percent: string | null; used: string | null; free: string | null };
  disk: { percent: string | null; used: string | null; free: string | null; total: string | null };
  disks: DiskInfo[];
  vms: string | null;
  lxcs: string | null;
  updates: string | null;
  updateAvailable: string | null;
  lastBoot: string | null;
  name: string | null;
  controls: Controls;
}

export interface Controls {
  start: string | null;
  stop: string | null;
  reboot: string | null;
  shutdown: string | null;
}

// Order matters: "neu_starten" also ends in "starten".
const CONTROL_PATTERNS: Array<[keyof Controls, RegExp]> = [
  ["reboot", /_(reboot|restart|neustart|neustarten|neu_starten)$/],
  ["shutdown", /_(shutdown|herunterfahren)$/],
  ["stop", /_(stop|stopp|stoppen)$/],
  ["start", /_(start|starten)$/],
];

/** Proxmox button entities (button.<key>_start / _neustart / ...) of one system. */
export function detectControls(key: string, ids: string[]): Controls {
  const controls: Controls = { start: null, stop: null, reboot: null, shutdown: null };
  const prefix = "button." + key + "_";
  for (const id of ids) {
    if (!id.startsWith(prefix)) continue;
    const hit = CONTROL_PATTERNS.find(([, re]) => re.test(id));
    if (hit && !controls[hit[0]]) controls[hit[0]] = id;
  }
  return controls;
}

const RAM_TOKENS = ["arbeitsspeicher", "memory", "ram"];

function lower(s: string): string {
  return String(s || "").toLowerCase();
}
function isRam(id: string): boolean {
  const l = lower(id);
  return RAM_TOKENS.some((t) => l.includes(t));
}

/**
 * Discover every system: the host node (binary_sensor.node_*_status) plus
 * every Proxmox guest (binary_sensor.lxc_*_NNN_status / qemu_*_NNN_status).
 */
export function discoverSystems(entities: (HassEntity | string)[]): SystemInfo[] {
  const list = (entities || []).map((e) =>
    typeof e === "string" ? { entity_id: e } : e
  );
  const systems = new Map<string, SystemInfo>();

  const pats: Array<[RegExp, SystemKind]> = [
    [/^binary_sensor\.node_(.+)_status$/, "node"],
    [/^binary_sensor\.lxc_(.+)_status$/, "lxc"],
    [/^binary_sensor\.qemu_(.+)_status$/, "qemu"],
  ];

  for (const e of list) {
    for (const [rx, kind] of pats) {
      const m = rx.exec(e.entity_id);
      if (m) {
        const key = `${kind}_${m[1]}`;
        if (!systems.has(key)) {
          systems.set(key, {
            key,
            kind,
            label: m[1].replace(/_/g, " "),
            statusEntity: e.entity_id,
          });
        } else {
          systems.get(key)!.statusEntity = e.entity_id;
        }
      }
    }
  }
  return Array.from(systems.values()).sort((a, b) => {
    // host first, then qemu, then lxc, alphabetical within
    const order = (k: SystemKind) => (k === "node" ? 0 : k === "qemu" ? 1 : 2);
    if (order(a.kind) !== order(b.kind)) return order(a.kind) - order(b.kind);
    return a.key.localeCompare(b.key);
  });
}

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function get(ids: string[], re: RegExp): string | null {
  return ids.find((id) => re.test(id)) || null;
}

/** Map every metric for a chosen system (node / lxc / qemu) to its entity id. */
export function detectEntities(key: string, entities: (HassEntity | string)[]): Mapping {
  const list = (entities || []).map((e) =>
    typeof e === "string" ? { entity_id: e } : e
  );
  // Systems whose key extends this one ("node_pve_2" vs "node_pve") share the
  // prefix; their entities must not be picked up for this system.
  const longer = discoverSystems(list)
    .map((s) => s.key)
    .filter((k) => k.startsWith(key + "_"))
    .flatMap((k) => ["." + k + "_", ".disk_" + k.replace(/^node_/, "") + "_"]);
  const ids = list
    .map((e) => e.entity_id)
    .filter((id) => !longer.some((p) => id.includes(p)));
  const prefix = esc(key) + "_";
  const reS = (suffix: string) => new RegExp("^sensor\\." + prefix + suffix, "i");
  const reBin = (suffix: string) => new RegExp("^binary_sensor\\." + prefix + suffix, "i");

  const kind: SystemKind = key.startsWith("lxc_")
    ? "lxc"
    : key.startsWith("qemu_")
    ? "qemu"
    : "node";

  const cpu = get(ids, reS("cpu"));

  let ramPercent: string | null = null;
  for (const id of ids) {
    if (
      id.startsWith("sensor." + prefix) &&
      isRam(id) &&
      /(prozent|percent|use_percent|usage_percent)/i.test(id)
    ) {
      ramPercent = id;
      break;
    }
  }
  const ramUsed = get(ids, reS("(genutzter_arbeitsspeicher|memory_use)"));
  const ramFree = get(ids, reS("(freier_arbeitsspeicher|memory_free)"));

  // Disks: only the node has disk_* entities
  const diskRe = new RegExp(
    "^sensor\\.disk_" + esc(key.replace(/^node_/, "")) + "_(.+)_(temperatur|temperature|grosse|gr..?e|size|verschleiss|wear|betriebsstunden)$",
    "i"
  );
  const disks = new Map<string, DiskInfo>();
  if (kind === "node") {
    for (const id of ids) {
      const m = diskRe.exec(id);
      if (!m) continue;
      const name = m[1];
      const metric = lower(m[2]);
      if (!disks.has(name))
        disks.set(name, {
          key: name,
          name,
          temperature: null,
          size: null,
          wear: null,
          powerOnHours: null,
          health: null,
        });
      const d = disks.get(name)!;
      if (metric.startsWith("temperatur") || metric.startsWith("temperature")) d.temperature = id;
      else if (metric.startsWith("grosse") || metric.startsWith("gr") || metric.startsWith("size"))
        d.size = id;
      else if (metric.startsWith("verschleiss") || metric.startsWith("wear")) d.wear = id;
      else if (metric.startsWith("betriebsstunden")) d.powerOnHours = id;
    }
    const healthRe = new RegExp(
      "^binary_sensor\\.disk_" + esc(key.replace(/^node_/, "")) + "_(.+)_(gesundheit|health)$",
      "i"
    );
    for (const id of ids) {
      const m = healthRe.exec(id);
      if (m && disks.has(m[1])) disks.get(m[1])!.health = id;
    }
  }
  const diskList = Array.from(disks.values()).map((d) => ({
    ...d,
    name: d.key.replace(/_/g, " "),
  }));
  for (const d of diskList) {
    if (!d.temperature) continue;
    const e = list.find((x) => x.entity_id === d.temperature);
    const fn = e && (e.friendly_name || (e.attributes && e.attributes.friendly_name));
    if (fn) {
      d.name = fn
        .replace(/temperatur|temperature$/i, "")
        .replace(/disk.*?:/i, "")
        .trim() || d.name;
    }
  }

  // Guest name / health (guests have a *_gesundheit binary)
  const health = get(ids, reBin("gesundheit|health"));
  const nameSensor = get(ids, reS("(knoten|node)$"));
  let name: string | null = null;
  if (nameSensor) {
    const s = list.find((x) => x.entity_id === nameSensor);
    if (s && s.state) name = s.state;
  }

  // Disk / storage usage (percent + size) - available for every system
  // (node + lxc + qemu) via *_prozentsatz_belegter_speicherplatz / *_grosse
  const diskPercent = get(
    ids,
    new RegExp("^sensor\\." + prefix + "(prozentsatz_belegter_speicherplatz|used_percent|usage_percent|disk_usage_percent)$", "i")
  );
  const diskTotal = get(ids, reS("(grosse|gr..?e|size|total)$"));
  const diskUsed = get(ids, reS("(genutzter_speicherplatz|disk_used|used_space)"));
  const diskFree = get(ids, reS("(freier_speicherplatz|disk_free|free_space)"));

  // Host-only summary fields
  const isHost = kind === "node";
  return {
    kind,
    status: get(ids, reBin("status")),
    health: kind === "node" ? null : health,
    cpu,
    ram: { percent: ramPercent, used: ramUsed, free: ramFree },
    disk: { percent: diskPercent, used: diskUsed, free: diskFree, total: diskTotal },
    disks: diskList,
    vms: isHost ? get(ids, reS("(virtual_machines_running|vms_running)")) : null,
    lxcs: isHost ? get(ids, reS("(container_laufen|lxc_running|containers_running)")) : null,
    updates: isHost ? get(ids, reS("(gesamte_updates|updates_total)")) : null,
    updateAvailable: isHost ? get(ids, reBin("(pakete_aktualisieren|updates_available)")) : null,
    lastBoot: get(ids, reS("(letzter_start|last_boot)")),
    name,
    controls: detectControls(key, ids),
  };
}

/** Every entity id a mapping reads (used to skip re-renders for unrelated state changes). */
export function mappingIds(m: Mapping): string[] {
  return [
    m.status,
    m.health,
    m.cpu,
    m.ram.percent,
    m.ram.used,
    m.ram.free,
    m.disk.percent,
    m.disk.used,
    m.disk.free,
    m.disk.total,
    m.vms,
    m.lxcs,
    m.updates,
    m.updateAvailable,
    m.lastBoot,
    ...m.disks.flatMap((d) => [d.temperature, d.size, d.wear, d.powerOnHours, d.health]),
    ...Object.values(m.controls),
  ].filter((id): id is string => !!id);
}

export const DETECTION_VERSION = 2;

/** Bekannte Apps/Proxmox-Systeme mit korrekter Markenschreibweise. */
const BRAND_NAMES: Record<string, string> = {
  adguard: "AdGuard",
  authentik: "Authentik",
  bitwarden: "Bitwarden",
  changedetection: "Changedetection",
  cloudflared: "Cloudflared",
  docker: "Docker",
  esphome: "ESPHome",
  frigate: "Frigate",
  grafana: "Grafana",
  homeassistant: "Home Assistant OS",
  haos: "HAOS",
  homebridge: "Homebridge",
  homepage: "Homepage",
  immich: "Immich",
  jellyfin: "Jellyfin",
  nextcloud: "Nextcloud",
  nginxproxymanager: "Nginx Proxy Manager",
  nodered: "Node-RED",
  omada: "Omada",
  paperless: "Paperless",
  pihole: "Pi-hole",
  plex: "Plex",
  portainer: "Portainer",
  proxmox: "Proxmox VE",
  pve: "Proxmox VE",
  tailscale: "Tailscale",
  truenas: "TrueNAS",
  unifi: "UniFi",
  uptimekuma: "Uptime Kuma",
  vaultwarden: "Vaultwarden",
  wireguard: "WireGuard",
  zigbee2mqtt: "Zigbee2MQTT",
};

/**
 * Anzeigename eines Systems ohne die Lauf-ID (z. B. "qemu_haos_101" -> "HAOS",
 * "lxc_adguard_999" -> "AdGuard"). Unbekannte Namen bekommen einen
 * großen Anfangsbuchstaben ("frigate" -> "Frigate").
 */
export function displayName(key: string): string {
  const name = key
    .replace(/^(node|lxc|qemu)_/, "")
    .replace(/_\d+$/, "")
    .toLowerCase();
  if (BRAND_NAMES[name]) return BRAND_NAMES[name];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
