/* server-card-plus — System-Monitor für Proxmox VE (CPU / RAM / Disk / Status) */
import { LitElement, html, css, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  discoverSystems,
  detectEntities,
  displayName,
  mappingIds,
  Mapping,
  Controls,
  SystemInfo,
} from './detect';
import { HomeAssistant } from './ha/types';
import { fireEvent } from './ha/fire_event';
import { CardConfig, Color, SystemOverride } from './config';
import { systemIcon } from './icons';
import { t } from './i18n';

// shortcut: fixed HDD temperature scale (°C), make configurable if needed
const HDD_TEMP = { max: 70, warn: 45, crit: 55 };

function toCss(v: Color | undefined, fallback: string): string {
  if (!v) return fallback;
  if (Array.isArray(v) && v.length === 3) return `rgb(${v[0]},${v[1]},${v[2]})`;
  return String(v);
}

// Destructive actions last; `confirm` = second tap required.
const CONTROL_DEFS: Array<{
  k: keyof Controls;
  icon: string;
  confirm: boolean;
  needsOnline: boolean;
}> = [
  { k: 'start', icon: 'mdi:play', confirm: false, needsOnline: false },
  { k: 'reboot', icon: 'mdi:restart', confirm: true, needsOnline: true },
  { k: 'shutdown', icon: 'mdi:power', confirm: true, needsOnline: true },
  { k: 'stop', icon: 'mdi:stop', confirm: true, needsOnline: true },
];

@customElement('server-card-plus')
export class ServerCardPlus extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: CardConfig;
  @state() private _armed: string | null = null; // button entity awaiting confirmation
  private _armTimer?: number;

  // Detection only reruns when the set of entity ids changes, not on every state update.
  private _ids: string[] = [];
  private _systemList: SystemInfo[] = [];
  private _mappings = new Map<string, Mapping | null>();

  private _refreshDetection(): void {
    const ids = this.hass ? Object.keys(this.hass.states) : [];
    if (ids.length === this._ids.length && ids.every((id, i) => id === this._ids[i])) return;
    this._ids = ids;
    this._systemList = discoverSystems(ids);
    this._mappings.clear();
  }

  get _systems(): SystemInfo[] {
    this._refreshDetection();
    return this._systemList;
  }

  /** Systems this card renders (one in single mode, all non-hidden in dashboard mode). */
  private _visibleKeys(): string[] {
    const systems = this._systems;
    const cfg = this.config;
    if (cfg && cfg.mode === 'dashboard') {
      const hidden = new Set(cfg.hidden_systems || []);
      return systems.filter((s) => !hidden.has(s.key)).map((s) => s.key);
    }
    const node = cfg && cfg.node ? cfg.node : 'auto';
    if (node !== 'auto' && systems.some((s) => s.key === node)) return [node];
    return systems.length ? [systems[0].key] : [];
  }

  private _mappingFor(key: string): Mapping | null {
    this._refreshDetection();
    if (!this._mappings.has(key)) {
      let m: Mapping | null = null;
      try {
        m = detectEntities(key, this._ids);
      } catch {
        // rendered as "no metrics" card
      }
      this._mappings.set(key, m);
    }
    return this._mappings.get(key)!;
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    const old = changed.get('hass') as HomeAssistant | undefined;
    if (changed.size > 1 || !changed.has('hass') || !old || !this.hass) return true;
    if (this._ids.length !== Object.keys(this.hass.states).length) return true;
    if (old.locale?.language !== this.hass.locale?.language) return true;
    // HA replaces a state object on change, so identity comparison is enough.
    return this._visibleKeys().some((key) => {
      const m = this._mappingFor(key);
      return !m || mappingIds(m).some((id) => old.states[id] !== this.hass!.states[id]);
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._armTimer);
  }

  static getStubConfig(hass?: HomeAssistant): CardConfig {
    const sys = hass ? discoverSystems(Object.keys(hass.states)) : [];
    return { type: 'custom:server-card-plus', node: sys.length ? sys[0].key : 'auto' };
  }

  static async getConfigElement() {
    await import('./editor');
    return document.createElement('server-card-plus-editor');
  }

  setConfig(config: CardConfig) {
    if (!config) throw new Error(t(this.hass, 'no_config'));
    this.config = config;
  }

  getCardSize() {
    return Math.max(4, this._visibleKeys().length * 3);
  }

  private _accent(ov?: SystemOverride): string {
    return toCss(ov?.accent ?? this.config?.accent, 'var(--primary-color, #4a90d9)');
  }

  private _palette(ov?: SystemOverride) {
    const cfg: Partial<CardConfig> = this.config || {};
    return {
      warn: ov?.warn ?? cfg.warn ?? 75,
      crit: ov?.crit ?? cfg.crit ?? 90,
      ok: toCss(ov?.color_ok ?? cfg.color_ok, 'var(--green, #2ecc71)'),
      warnColor: toCss(ov?.color_warn ?? cfg.color_warn, 'var(--yellow, #f1c40f)'),
      critColor: toCss(ov?.color_crit ?? cfg.color_crit, 'var(--red, #e74c3c)'),
    };
  }

  private _overrideFor(key: string): SystemOverride | undefined {
    return (this.config && this.config.overrides && this.config.overrides[key]) || undefined;
  }

  private _icon(key: string, ov?: SystemOverride): string {
    return (ov && ov.icon) || (this.config && this.config.icon) || systemIcon(key);
  }

  private _state(id: string | null) {
    if (!id || !this.hass) return null;
    return this.hass.states[id] || null;
  }

  private _val(id: string | null): string | null {
    const s = this._state(id);
    return s ? s.state : null;
  }

  /** Percent 0-100, or null when the sensor is missing / unavailable / not numeric. */
  private _pct(id: string | null): number | null {
    const v = parseFloat(this._val(id) ?? '');
    return isFinite(v) ? Math.max(0, Math.min(100, v)) : null;
  }

  private _hddTempLine(m: Mapping) {
    if (!(this.config && this.config.show_hdd_temp)) return nothing;
    const temps = m.disks
      .map((d) => parseFloat(this._val(d.temperature) ?? ''))
      .filter((v) => isFinite(v))
      .map((v) => v.toFixed(0) + ' °C');
    if (!temps.length) return nothing;
    return html`
      <div class="row hdd-temp">
        <span class="lbl">
          <ha-icon icon="mdi:harddisk" class="browicon disk-icon"></ha-icon>
          HDD
        </span>
        <span class="hdd-temps">${temps.join(' · ')}</span>
      </div>
    `;
  }

  private _summaryLine(m: Mapping) {
    const parts: string[] = [];
    if (m.vms) parts.push(`${this._val(m.vms)} VMs`);
    if (m.lxcs) parts.push(`${this._val(m.lxcs)} LXCs`);
    if (m.updates) parts.push(`${this._val(m.updates)} Updates`);
    if (m.name) parts.push(t(this.hass, 'host', { v: m.name }));
    if (m.lastBoot) {
      const ts = this._state(m.lastBoot);
      if (ts && ts.attributes && ts.attributes.device_class === 'timestamp') {
        const d = new Date(ts.state);
        if (!isNaN(d.getTime())) {
          const days = Math.floor((Date.now() - d.getTime()) / 86400000);
          parts.push(t(this.hass, 'uptime', { d: days }));
        }
      }
    }
    return parts.length ? html`<div class="summary">${parts.join(' · ')}</div>` : nothing;
  }

  private _controls(m: Mapping, statusState: string | null | undefined) {
    if (!(this.config && this.config.show_controls)) return nothing;
    const defs = CONTROL_DEFS.filter((d) => m.controls[d.k]);
    if (!defs.length) return nothing;
    return html`
      <div class="controls">
        ${defs.map((d) => {
          const id = m.controls[d.k]!;
          const armed = this._armed === id;
          const title = t(this.hass, `${d.k}_t`);
          const disabled =
            statusState === (d.needsOnline ? 'off' : 'on') ||
            this._val(id) === 'unavailable';
          return html`
            <button
              class="ctl ${armed ? 'armed' : ''}"
              ?disabled=${disabled}
              title=${title}
              aria-label=${armed ? t(this.hass, 'confirm', { v: title }) : title}
              @click=${() => this._press(id, d.confirm)}
            >
              <ha-icon icon=${armed ? 'mdi:check' : d.icon}></ha-icon>
              <span>${armed ? t(this.hass, 'sure') : t(this.hass, d.k)}</span>
            </button>
          `;
        })}
      </div>
    `;
  }

  private async _press(id: string, confirm: boolean) {
    clearTimeout(this._armTimer);
    if (confirm && this._armed !== id) {
      this._armed = id;
      this._armTimer = window.setTimeout(() => (this._armed = null), 4000);
      return;
    }
    this._armed = null;
    try {
      await this.hass?.callService?.('button', 'press', { entity_id: id });
    } catch (e) {
      fireEvent(this, 'hass-notification', {
        message: t(this.hass, 'failed', { v: (e as Error).message }),
      });
    }
  }

  private _rackCard(
    key: string,
    m: Mapping,
    title: string,
    icon: string,
    style: string,
    statusState: string | null | undefined,
    statusText: string,
  ) {
    const { warn, crit } = this._palette(this._overrideFor(key));
    const rows: Array<[string, number | null]> = [
      ['CPU', this._pct(m.cpu)],
      ['RAM', this._pct(m.ram.percent)],
      ['Disk', this._pct(m.disk.percent)],
    ];
    return html`
      <ha-card class="rack" style=${style}>
        <div class="r-head">
          <span
            class="led ${statusState === 'on' ? 'on' : statusState === 'off' ? 'off' : ''}"
            role="img"
            aria-label=${statusText}
            title=${statusText}
          ></span>
          <ha-icon icon=${icon} class="r-icon"></ha-icon>
          <span class="r-title">${title}</span>
          <span class="r-kind">${t(this.hass, `short_${m.kind}`)}</span>
        </div>
        ${rows.map(
          ([label, pct]) => html`
            <div class="r-row">
              <span class="r-lbl">${label}</span>
              <div
                class="seg"
                role="meter"
                aria-label=${label}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${pct === null ? nothing : pct.toFixed(0)}
              >
                ${Array.from({ length: 20 }, (_, i) => {
                  // the unlit scale already shows where warn / crit begin
                  const zone = i * 5 >= crit ? 'c' : i * 5 >= warn ? 'w' : '';
                  const lit = pct !== null && pct >= i * 5 + 2.5;
                  return html`<i class="${zone} ${lit ? 'lit' : ''}"></i>`;
                })}
              </div>
              <span class="r-num">${pct === null ? '–' : html`${pct.toFixed(0)}<small>%</small>`}</span>
            </div>
          `,
        )}
        ${m.disk.total
          ? html`<div class="row subtotal">${t(this.hass, 'total', { v: this._val(m.disk.total) ?? '' })}</div>`
          : nothing}
        ${this._hddTempLine(m)} ${this._summaryLine(m)} ${this._controls(m, statusState)}
      </ha-card>
    `;
  }

  render() {
    if (!this.hass) return nothing;
    if (!this._systems.length)
      return html`<ha-card><div class="warnbox">${t(this.hass, 'loading')}</div></ha-card>`;

    const keys = this._visibleKeys();
    if (!keys.length)
      return html`<ha-card><div class="warnbox">${t(this.hass, 'all_hidden')}</div></ha-card>`;
    if (this.config && this.config.mode === 'dashboard')
      return html`<div class="dash">${keys.map((k) => this._systemCard(k))}</div>`;
    return this._systemCard(keys[0]);
  }

  private _systemCard(key: string) {
    const isMulti = !!(this.config && this.config.mode === 'dashboard');
    const ov = this._overrideFor(key);
    const title = (ov && ov.title)
      ? ov.title
      : !isMulti && this.config && this.config.title
      ? this.config.title
      : displayName(key);
    const { ok, warnColor, critColor } = this._palette(ov);
    const colors = { ok, warn: warnColor, crit: critColor };
    const icon = this._icon(key, ov);
    const style = `--accent:${this._accent(ov)}; --green:${colors.ok}; --yellow:${colors.warn}; --red:${colors.crit}`;
    const m = this._mappingFor(key);

    const head = (kind: string, statusState?: string | null, statusText?: string) => html`
      <div class="c-head">
        <span class="c-tile"><ha-icon icon=${icon}></ha-icon></span>
        <div class="c-titles">
          <span class="c-title">${title}</span>
          <span class="c-kind">${kind}</span>
        </div>
        ${statusText
          ? html`<span class="c-status ${statusState === 'off' ? 'off' : ''}">
              <span class="c-dot ${statusState === 'on' ? 'on' : ''}"></span>${statusText}
            </span>`
          : nothing}
      </div>
    `;

    if (!m)
      return html`<ha-card class="apple" style=${style}>
        ${head(key)}
        <p class="empty">${t(this.hass, 'no_metrics', { key })}</p>
      </ha-card>`;

    const statusState = m.status ? this._val(m.status) : null;
    const statusText = t(
      this.hass,
      statusState === 'on' ? 'online' : statusState === 'off' ? 'offline' : 'unknown',
    );

    if (this.config && this.config.design === 'rack')
      return this._rackCard(key, m, title, icon, style, statusState, statusText);

    const circles = this.config && this.config.design === 'circles';
    const items = this._metrics(m, ov, colors);

    return html`
      <ha-card class="apple" style=${style}>
        ${head(t(this.hass, `kind_${m.kind}`), statusState, statusText)}
        ${circles
          ? html`<div class="c-rings">
              ${items.map(
                (it) => html`
                  <div class="c-ring" role="meter" aria-label=${it.label} aria-valuemin="0"
                    aria-valuemax=${it.max} aria-valuenow=${it.value ?? nothing}>
                    <div class="c-dial">
                      <svg viewBox="0 0 36 36" aria-hidden="true">
                        <circle class="c-track" cx="18" cy="18" r="15.9155"></circle>
                        ${it.value === null
                          ? nothing
                          : html`<circle
                              class="c-arc"
                              cx="18"
                              cy="18"
                              r="15.9155"
                              style="stroke:${it.color};stroke-dasharray:${it.fill} 100"
                            ></circle>`}
                      </svg>
                      <span class="c-val">${it.value ?? '–'}${it.value === null ? nothing : html`<small>${it.unit}</small>`}</span>
                    </div>
                    <span class="c-lbl" title=${it.label}>${it.label}</span>
                    ${it.sub ? html`<span class="c-sub">${it.sub}</span>` : nothing}
                  </div>
                `,
              )}
            </div>`
          : html`<div class="b-list">
              ${items.map(
                (it) => html`
                  <div class="b-row" role="meter" aria-label=${it.label} aria-valuemin="0"
                    aria-valuemax=${it.max} aria-valuenow=${it.value ?? nothing}>
                    <div class="b-top">
                      <span class="b-lbl" title=${it.label}>${it.label}</span>
                      ${it.sub ? html`<span class="b-sub">${it.sub}</span>` : nothing}
                      <span class="b-val">${it.value ?? '–'}${it.value === null ? nothing : html`<small>${it.unit}</small>`}</span>
                    </div>
                    <div class="b-track">
                      <div class="b-fill" style="width:${it.fill}%;background:${it.color}"></div>
                    </div>
                  </div>
                `,
              )}
            </div>`}

        ${this._summaryLine(m)} ${this._controls(m, statusState)}
      </ha-card>
    `;
  }

  /** Werte für die Apple-Designs (Balken / Kreise); HDD-Temperaturen optional. */
  private _metrics(m: Mapping, ov: SystemOverride | undefined, colors: { ok: string; warn: string; crit: string }) {
    const { warn, crit } = this._palette(ov);
    const color = (v: number, w: number, c: number) =>
      v >= c ? colors.crit : v >= w ? colors.warn : colors.ok;
    const items = (
      [
        ['CPU', m.cpu, null],
        ['RAM', m.ram.percent, null],
        ['Disk', m.disk.percent, m.disk.total ? this._val(m.disk.total) : null],
      ] as Array<[string, string | null, string | null]>
    ).map(([label, id, sub]) => {
      const p = this._pct(id);
      return {
        label,
        fill: p ?? 0,
        value: p === null ? null : p.toFixed(0),
        unit: '%',
        max: 100,
        color: color(p ?? 0, warn, crit),
        sub,
      };
    });
    if (this.config && this.config.show_hdd_temp) {
      for (const d of m.disks) {
        const temp = parseFloat(this._val(d.temperature) ?? '');
        if (!isFinite(temp)) continue;
        items.push({
          label: d.name,
          fill: Math.max(0, Math.min(100, (temp / HDD_TEMP.max) * 100)),
          value: temp.toFixed(0),
          unit: '°C',
          max: HDD_TEMP.max,
          color: color(temp, HDD_TEMP.warn, HDD_TEMP.crit),
          sub: 'HDD',
        });
      }
    }
    return items;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
        background: var(--card-background-color, #1e1e1e);
        color: var(--primary-text-color, #e1e1e1);
        border-radius: 12px;
        border: 1px solid var(--divider-color, #2a2a2a);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: box-shadow 0.2s ease;
      }

      ha-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      /* Dashboard-Mode: responsive Grid aus mehreren System-Karten */
      .dash {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 12px;
      }

      .row {
        display: grid;
        grid-template-columns: auto 1fr 60px;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
      }

      .lbl {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.82rem;
        color: var(--secondary-text-color);
        font-weight: 500;
        letter-spacing: 0.02em;
      }

      .browicon {
        --mdc-icon-size: 16px;
        color: var(--accent);
        flex: 0 0 auto;
      }

      /* HDD-Icon etwas kleiner, damit es nicht über die Karte ragt */
      .browicon.disk-icon {
        --mdc-icon-size: 15px;
      }

      .subtotal {
        grid-column: 2 / 3;
        justify-self: end;
        font-size: 0.7rem;
        color: var(--secondary-text-color);
        font-weight: 400;
        letter-spacing: 0.03em;
        padding-right: 2px;
      }

      .row.hdd-temp {
        grid-template-columns: auto 1fr;
        gap: 10px;
      }

      .hdd-temps {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary-text-color);
        font-variant-numeric: tabular-nums;
      }

      .summary {
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--divider-color, #2a2a2a);
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .empty {
        margin: 16px 0 0;
        color: var(--secondary-text-color);
        font-size: 0.85rem;
      }

      .warnbox {
        color: var(--red, #e74c3c);
        font-weight: 500;
        padding: 8px;
        text-align: center;
        font-size: 0.85rem;
        border: 1px solid var(--red, #e74c3c);
        border-radius: 10px;
        margin: 0;
        background: rgba(231, 76, 60, 0.08);
      }

      /* Steuerung (Start / Neustart / Beenden / Stopp) */
      .controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
        gap: 6px;
        margin-top: 12px;
      }

      .ctl {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 6px 4px;
        font: inherit;
        font-size: 0.72rem;
        color: var(--primary-text-color);
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
        border: 1px solid var(--divider-color, #2a2a2a);
        border-radius: 8px;
        cursor: pointer;
      }

      .ctl ha-icon {
        --mdc-icon-size: 18px;
        color: var(--accent);
      }

      .ctl:hover:not(:disabled) {
        border-color: var(--accent);
      }

      .ctl:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      .ctl:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .ctl.armed,
      .ctl.armed ha-icon {
        background: var(--red, #e74c3c);
        border-color: var(--red, #e74c3c);
        color: #fff;
      }

      /* Design "Rack": Frontblende mit segmentierten LED-Metern */
      ha-card.rack {
        padding: 14px 16px;
        border-radius: 6px;
        box-shadow: none;
      }

      ha-card.rack:hover {
        box-shadow: none;
      }

      .r-head {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 12px;
        margin-bottom: 10px;
        border-bottom: 1px solid var(--divider-color, #2a2a2a);
      }

      .led {
        width: 8px;
        height: 8px;
        border-radius: 2px;
        flex: 0 0 auto;
        background: var(--secondary-text-color);
      }

      .led.on {
        background: var(--green, #2ecc71);
        box-shadow: 0 0 6px var(--green, #2ecc71);
      }

      .led.off {
        background: var(--red, #e74c3c);
      }

      .r-icon {
        --mdc-icon-size: 22px;
        color: var(--accent);
        flex: 0 0 auto;
      }

      .r-title {
        flex: 1;
        min-width: 0;
        font-size: 1rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .r-kind {
        font-size: 0.72rem;
        color: var(--secondary-text-color);
        border: 1px solid var(--divider-color, #2a2a2a);
        border-radius: 3px;
        padding: 1px 6px;
      }

      .r-row {
        display: grid;
        grid-template-columns: 2.6rem 1fr 3.2rem;
        align-items: center;
        gap: 10px;
        margin: 8px 0;
      }

      .r-lbl {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .seg {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        gap: 2px;
        height: 14px;
      }

      .seg i {
        border-radius: 1px;
        background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      }

      .seg i.w {
        background: color-mix(in srgb, var(--yellow, #f1c40f) 22%, transparent);
      }

      .seg i.c {
        background: color-mix(in srgb, var(--red, #e74c3c) 22%, transparent);
      }

      .seg i.lit {
        background: var(--green, #2ecc71);
      }

      .seg i.lit.w {
        background: var(--yellow, #f1c40f);
      }

      .seg i.lit.c {
        background: var(--red, #e74c3c);
      }

      .r-num {
        text-align: right;
        font-size: 1.05rem;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .r-num small {
        font-size: 0.7rem;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .rack .ctl {
        border-radius: 4px;
      }

      /* Designs "Klassisch" (Balken) + "Kreise" im Stil der Apple-Widgets */
      ha-card.apple {
        padding: 20px;
        border-radius: 22px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      ha-card.apple:hover {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.08);
      }

      .c-head {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .c-tile {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        flex: 0 0 auto;
        border-radius: 11px;
        background: color-mix(in srgb, var(--accent) 15%, transparent);
        color: var(--accent);
        --mdc-icon-size: 22px;
      }

      .c-titles {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .c-title {
        font-size: 1.05rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .c-kind,
      .c-status {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }

      .c-status {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 0 0 auto;
      }

      .c-status.off {
        color: var(--red, #e74c3c);
      }

      .c-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: currentColor;
      }

      .c-dot.on {
        background: var(--green, #2ecc71);
      }

      .c-rings {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
        gap: 14px 6px;
        margin: 18px 0 4px;
      }

      .c-ring {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 0;
      }

      .c-dial {
        position: relative;
        width: min(58px, 100%);
        aspect-ratio: 1;
      }

      .c-dial svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .c-track,
      .c-arc {
        fill: none;
        stroke-width: 3.4;
      }

      .c-track {
        stroke: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      }

      .c-arc {
        stroke-linecap: round;
        transition: stroke-dasharray 0.6s cubic-bezier(0.3, 0.7, 0.4, 1);
      }

      .c-val {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      }

      .c-val small {
        font-size: 0.6em;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-left: 1px;
      }

      .c-lbl {
        margin-top: 6px;
        max-width: 100%;
        font-size: 0.78rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .c-sub {
        font-size: 0.72rem;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .b-list {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-top: 20px;
      }

      .b-top {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .b-lbl {
        min-width: 0;
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .b-sub {
        font-size: 0.72rem;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .b-val {
        margin-left: auto;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        font-variant-numeric: tabular-nums;
      }

      .b-val small {
        font-size: 0.7em;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-left: 1px;
      }

      .b-track {
        height: 6px;
        margin-top: 6px;
        border-radius: 3px;
        overflow: hidden;
        background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      }

      .b-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.6s cubic-bezier(0.3, 0.7, 0.4, 1);
      }

      .apple .summary {
        margin-top: 16px;
        padding-top: 14px;
        border-top-color: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .apple .controls {
        margin-top: 16px;
        gap: 8px;
      }

      .apple .ctl {
        padding: 8px 4px;
        border: none;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        font-size: 0.75rem;
        font-weight: 500;
      }

      .apple .ctl:hover:not(:disabled):not(.armed) {
        background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      }

      .apple .ctl.armed {
        background: var(--red, #e74c3c);
      }

      @media (prefers-reduced-motion: reduce) {
        .c-arc,
        .b-fill {
          transition: none;
        }
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'server-card-plus': ServerCardPlus;
  }
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'server-card-plus',
  name: 'Server Card Plus',
  description: 'Proxmox VE system monitor with auto-detection (CPU, RAM, disk, status, controls).',
});
