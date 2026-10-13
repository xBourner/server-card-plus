// Run: npm test (Node >= 23.6, strips TS types natively)
const assert = require("node:assert/strict");
const { detectControls, detectEntities, discoverSystems, mappingIds, displayName } = require("../src/detect.ts");

// --- controls (DE + EN) ---
const de = detectControls("qemu_haos_101", [
  "button.qemu_haos_101_starten",
  "button.qemu_haos_101_stoppen",
  "button.qemu_haos_101_neu_starten",
  "button.qemu_haos_101_herunterfahren",
  "button.qemu_other_102_starten",
]);
assert.deepEqual(de, {
  start: "button.qemu_haos_101_starten",
  stop: "button.qemu_haos_101_stoppen",
  reboot: "button.qemu_haos_101_neu_starten",
  shutdown: "button.qemu_haos_101_herunterfahren",
});

const en = detectControls("lxc_adguard_100", [
  "button.lxc_adguard_100_start",
  "button.lxc_adguard_100_stop",
  "button.lxc_adguard_100_reboot",
  "button.lxc_adguard_100_shutdown",
]);
assert.equal(en.reboot, "button.lxc_adguard_100_reboot");
assert.equal(en.start, "button.lxc_adguard_100_start");

assert.deepEqual(detectControls("node_pve", ["sensor.node_pve_cpu"]), {
  start: null,
  stop: null,
  reboot: null,
  shutdown: null,
});

// --- German install: host + guests ---
const deIds = [
  "binary_sensor.node_pve_status",
  "sensor.node_pve_cpu_auslastung",
  "sensor.node_pve_arbeitsspeicher_prozent",
  "sensor.node_pve_prozentsatz_belegter_speicherplatz",
  "sensor.node_pve_grosse",
  "sensor.node_pve_virtual_machines_running",
  "sensor.node_pve_container_laufen",
  "sensor.disk_pve_sda_temperatur",
  "binary_sensor.disk_pve_sda_gesundheit",
  "binary_sensor.qemu_haos_101_status",
  "sensor.qemu_haos_101_cpu_auslastung",
  "binary_sensor.lxc_adguard_100_status",
];
const systems = discoverSystems(deIds).map((s) => s.key);
assert.deepEqual(systems, ["node_pve", "qemu_haos_101", "lxc_adguard_100"]); // host, VM, LXC

const host = detectEntities("node_pve", deIds);
assert.equal(host.kind, "node");
assert.equal(host.status, "binary_sensor.node_pve_status");
assert.equal(host.cpu, "sensor.node_pve_cpu_auslastung");
assert.equal(host.ram.percent, "sensor.node_pve_arbeitsspeicher_prozent");
assert.equal(host.disk.percent, "sensor.node_pve_prozentsatz_belegter_speicherplatz");
assert.equal(host.disk.total, "sensor.node_pve_grosse");
assert.equal(host.vms, "sensor.node_pve_virtual_machines_running");
assert.equal(host.disks.length, 1);
assert.equal(host.disks[0].temperature, "sensor.disk_pve_sda_temperatur");
assert.equal(host.disks[0].health, "binary_sensor.disk_pve_sda_gesundheit");
assert.ok(mappingIds(host).includes("sensor.disk_pve_sda_temperatur"));

const vm = detectEntities("qemu_haos_101", deIds);
assert.equal(vm.kind, "qemu");
assert.equal(vm.cpu, "sensor.qemu_haos_101_cpu_auslastung");
assert.equal(vm.vms, null); // host-only field

// --- English install ---
const enHost = detectEntities("node_pve", [
  "binary_sensor.node_pve_status",
  "sensor.node_pve_cpu_usage",
  "sensor.node_pve_memory_usage_percent",
]);
assert.equal(enHost.cpu, "sensor.node_pve_cpu_usage");
assert.equal(enHost.ram.percent, "sensor.node_pve_memory_usage_percent");

// --- prefix collision: node "pve" must not read node "pve_2" ---
const twoNodes = [
  "binary_sensor.node_pve_status",
  "binary_sensor.node_pve_2_status",
  "sensor.node_pve_2_cpu_auslastung",
  "sensor.disk_pve_2_sdb_temperatur",
];
const pve = detectEntities("node_pve", twoNodes);
assert.equal(pve.cpu, null);
assert.equal(pve.disks.length, 0);
assert.equal(pve.status, "binary_sensor.node_pve_status");
assert.equal(detectEntities("node_pve_2", twoNodes).cpu, "sensor.node_pve_2_cpu_auslastung");

// --- display names ---
assert.equal(displayName("qemu_haos_101"), "HAOS");
assert.equal(displayName("lxc_frigate_105"), "Frigate");

console.log("detect tests ok");
