# Server Card Plus

Custom Card für Home Assistant: System-Monitor für die **Proxmox VE**-Integration.
Erkennt Host, VMs und LXC-Container automatisch und zeigt CPU, RAM, Disk,
Online-Status und optional HDD-Temperaturen – mit optionaler Steuerung
(Start, Neustart, Herunterfahren, Stopp).

Version 0.3.0 · Oberfläche auf Deutsch und Englisch (folgt der HA-Sprache).

## Features
- Auto-Detection aller Systeme (`binary_sensor.node_*_status`, `qemu_*`, `lxc_*`)
- Drei Designs, im Editor wählbar:
  - **Klassisch** – schlanke Balken im Stil der Apple-Widgets
  - **Kreise** – Ringe im Stil der Apple-Widgets
  - **Rack** – LED-Segmente; die Skala zeigt Warn- und Critical-Bereich
- Einzel-Modus (ein System) oder Dashboard-Modus (alle Systeme als Grid,
  einzeln ausblendbar und pro System anpassbar)
- Warn-/Critical-Schwellen und Farben global oder pro System
- HDD-Temperaturen (Host) als eigene Ringe/Balken, Skala 0–70 °C,
  gelb ab 45 °C, rot ab 55 °C
- Steuerung über die Button-Entitäten der Integration; Neustart, Herunterfahren
  und Stopp erfordern einen zweiten Tipp zur Bestätigung
- Sprachrobust: erkennt deutsche *und* englische Entity-IDs
- Fehlende oder nicht verfügbare Werte werden als „–“ angezeigt, nicht als 0 %

## Installation
**HACS:** Custom Repository hinzufügen, Kategorie **Dashboard**.

**Manuell:** `dist/server-card-plus.js` nach `<config>/www/` kopieren und unter
**Einstellungen → Dashboards → Ressourcen** registrieren:

| URL | Typ |
|-----|-----|
| `/local/server-card-plus.js` | JavaScript-Modul |

## Konfiguration
Alles lässt sich im visuellen Editor einstellen. YAML-Beispiel:

```yaml
type: custom:server-card-plus
mode: single            # single | dashboard
node: auto              # auto = erstes System, oder z. B. node_pve / qemu_haos_101
design: circles         # classic | circles | rack
show_hdd_temp: true
show_controls: true
warn: 75
crit: 90
```

| Option | Beschreibung |
|--------|--------------|
| `mode` | `single` (ein System) oder `dashboard` (alle als Grid) |
| `node` | System-Key im Einzel-Modus, `auto` = erstes gefundenes |
| `design` | `classic`, `circles` oder `rack` |
| `title`, `icon` | Eigener Titel / eigenes Icon (Einzel-Modus) |
| `warn`, `crit` | Schwellen in % (Standard 75 / 90) |
| `color_ok`, `color_warn`, `color_crit`, `accent` | Farben (CSS-String oder `[r, g, b]`) |
| `show_hdd_temp` | HDD-Temperaturen anzeigen (nur Host) |
| `show_controls` | Steuer-Buttons anzeigen |
| `hidden_systems` | Im Dashboard-Modus ausgeblendete System-Keys |
| `overrides` | Pro System-Key: `title`, `icon`, `warn`, `crit`, Farben |

## Steuerung
Die Karte drückt die Button-Entitäten der Proxmox-Integration
(`button.<system>_start`, `_stop`, `_reboot`, `_shutdown` bzw. die deutschen
Varianten `_starten`, `_stoppen`, `_neu_starten`, `_herunterfahren`).
Stellt die Integration keine Buttons bereit oder sind sie deaktiviert, zeigt
der Editor einen Hinweis. Start ist gesperrt, solange das System läuft; die
übrigen Aktionen, solange es aus ist.

## Wie die Auto-Detection funktioniert
- `discoverSystems()` findet alle `binary_sensor.{node,qemu,lxc}_*_status`.
- `detectEntities()` ordnet per Präfix (`sensor.<system>_…`) zu – CPU, RAM
  (`arbeitsspeicher`/`memory` + `prozent`/`percent`), Disk-Belegung, Disks
  (`disk_<node>_<disk>_temperatur`/`temperature`, Größe, Verschleiß, Health).
- Systeme mit gemeinsamem Präfix (z. B. `node_pve` und `node_pve_2`) werden
  sauber getrennt.
- Die Erkennung läuft nur neu, wenn sich die Liste der Entitäten ändert, und
  die Karte rendert nur bei Änderungen an ihren eigenen Entitäten.

## Projektstruktur
```
src/
  server-card-plus.ts   Karte (Lit)
  editor.ts             Visueller Editor
  detect.ts             Auto-Detection (ohne Browser testbar)
  config.ts             Gemeinsame Config-Typen
  i18n.ts               Texte DE / EN
  icons.ts              Automatische Icons je System
  ha/                   Minimale HA-Typen und fireEvent
test/detect.test.cjs    Tests der Detection
dist/server-card-plus.js  Build (ES-Modul, eine Datei)
```

## Entwicklung
```bash
npm install
npm test           # Detection-Tests (Node >= 23.6)
npm run build      # tsc + vite build → dist/server-card-plus.js
```

## Roadmap
- [ ] Glances / System Monitor als weitere Quellen
- [ ] Klick auf Disk → SMART-Details
- [ ] HDD-Temperaturgrenzen konfigurierbar
