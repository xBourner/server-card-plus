<h1 id="top" align="center">Server Card Plus</h1>

<p align="center">
  <a href="https://github.com/hacs/integration">
    <img src="https://img.shields.io/badge/hacs-custom-orange.svg?style=for-the-badge" alt="HACS">
  </a>
  <a href="https://github.com/xBourner/server-card-plus/releases/">
    <img src="https://img.shields.io/github/release/xBourner/server-card-plus?style=for-the-badge" alt="GitHub release">
  </a>
  <a href="https://github.com/xBourner/server-card-plus/issues">
    <img src="https://img.shields.io/github/issues/xBourner/server-card-plus?style=for-the-badge" alt="Issues">
  </a>
</p>

## Overview

**Server Card Plus** is a system monitor card for Home Assistant and the Proxmox VE
integration. It finds your host, VMs and containers automatically and shows CPU, RAM,
disk usage and online status – in three designs, with optional disk temperatures and
start / reboot / shutdown / stop controls.

## 📖 Documentation

Installation, configuration and troubleshooting:
**[xbourner.github.io/card-docu/server-card-plus](https://xbourner.github.io/card-docu/server-card-plus/)**

## 📥 Installation

### HACS

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=xBourner&repository=server-card-plus&category=plugin)

Add `https://github.com/xBourner/server-card-plus` as a custom repository (category
**Dashboard**), install the card and clear your browser cache.

### Manual

Copy `dist/server-card-plus.js` to `config/www/` and register it as a resource
(`/local/server-card-plus.js`, type **JavaScript Module**).

Then add the card via **Edit dashboard → Add card → Server Card Plus**.

## 🛠️ Development

```bash
npm install
npm run build   # → dist/server-card-plus.js
```

## License

MIT – see [LICENSE](LICENSE).
