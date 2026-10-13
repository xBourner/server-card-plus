/* Shared config types for card + editor. */
import { LovelaceCardConfig } from './ha/types';

/** Colour as CSS string or `[r, g, b]` from HA's color_rgb selector. */
export type Color = string | [number, number, number];

export interface SystemOverride {
  title?: string; // eigene Beschriftung für dieses System
  icon?: string; // eigenes Icon (mdi/simple-icons)
  warn?: number; // eigene Warn-Schwelle in %
  crit?: number; // eigene Critical-Schwelle in %
  color_ok?: Color;
  color_warn?: Color;
  color_crit?: Color;
  accent?: Color; // Akzentfarbe (Icon + Labels)
}

export interface CardConfig extends LovelaceCardConfig, Omit<SystemOverride, 'title'> {
  title?: string;
  node?: string; // System-Key oder "auto"
  mode?: 'single' | 'dashboard'; // dashboard = alle Systeme als Grid
  design?: 'classic' | 'circles' | 'rack';
  hidden_systems?: string[]; // im Dashboard-Mode ausgeblendete System-Keys
  overrides?: Record<string, SystemOverride>; // pro System-Key eigene Werte (Dashboard-Mode)
  show_hdd_temp?: boolean;
  show_controls?: boolean; // Start / Neustart / Beenden / Stopp über die Proxmox-Buttons
}
