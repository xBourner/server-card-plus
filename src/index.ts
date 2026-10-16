import { version } from "../package.json";
import "./server-card-plus";

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
    }>;
  }
}

console.info(
  `%c SERVER-CARD-PLUS %c v${version} `,
  "color: steelblue; background: black; font-weight: bold;",
  "color: white ; background: dimgray; font-weight: bold;"
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'server-card-plus',
  name: 'Server Card Plus',
  description: 'Proxmox VE system monitor with auto-detection (CPU, RAM, disk, status, controls).',
});
