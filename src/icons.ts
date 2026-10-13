/* Auto icon per system (simple-icons for known apps, mdi fallback per kind). */
const SI: Record<string, string> = {
  adguard: 'simple-icons:adguard',
  authentik: 'simple-icons:authentik',
  changedetection: 'simple-icons:changedetection',
  cloudflared: 'simple-icons:cloudflare',
  docker: 'simple-icons:docker',
  frigate: 'simple-icons:frigate',
  homepage: 'simple-icons:homepage',
  immich: 'simple-icons:immich',
  nginxproxymanager: 'simple-icons:nginx',
  omada: 'simple-icons:omadacloud',
  paperless: 'simple-icons:paperless',
  uptimekuma: 'simple-icons:uptimekuma',
  vaultwarden: 'simple-icons:bitwarden',
  bitwarden: 'simple-icons:bitwarden',
  homeassistant: 'simple-icons:homeassistant',
  haos: 'simple-icons:homeassistant',
  pve: 'simple-icons:proxmox',
  proxmox: 'simple-icons:proxmox',
  pihole: 'simple-icons:pihole',
  plex: 'simple-icons:plex',
  jellyfin: 'simple-icons:jellyfin',
  nextcloud: 'simple-icons:nextcloud',
  wireguard: 'simple-icons:wireguard',
  tailscale: 'simple-icons:tailscale',
  grafana: 'simple-icons:grafana',
  portainer: 'simple-icons:portainer',
  truenas: 'simple-icons:truenas',
  unifi: 'simple-icons:ubiquiti',
  homebridge: 'simple-icons:homebridge',
  nodered: 'simple-icons:nodered',
  esphome: 'simple-icons:esphome',
  zigbee2mqtt: 'simple-icons:zigbee',
};

export function systemIcon(key: string): string {
  const name = key
    .replace(/^(node|lxc|qemu)_/, '')
    .replace(/_\d+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  if (SI[name]) return SI[name];
  if (key.startsWith('lxc_')) return 'mdi:docker';
  if (key.startsWith('qemu_')) return 'mdi:chip';
  return 'mdi:server';
}
