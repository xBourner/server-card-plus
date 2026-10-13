/*
 * Minimal Home Assistant type declarations (mirrors calendar-card-plus/ha/types.ts)
 * so the card compiles without depending on HA's internal type packages.
 */
export interface HomeAssistant {
  states: Record<string, HassEntityState>;
  user?: { name?: string; is_admin?: boolean };
  config?: Record<string, any>;
  themes?: Record<string, any>;
  selectedTheme?: any;
  language?: string;
  locale?: any;
  connection?: any;
  callService?: (domain: string, service: string, data?: any) => Promise<any>;
  callWS?: (msg: any) => Promise<any>;
  formatEntityState?: (stateObj: HassEntityState, state?: string) => string;
  localize?: (key: string, ...args: any[]) => string;
}

export interface HassEntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
  context?: any;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: any;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}
