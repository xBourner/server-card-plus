/*
 * fireEvent helper (mirrors calendar-card-plus/ha/fire_event.ts)
 */
export const fireEvent = (
  node: HTMLElement | Window,
  type: string,
  detail?: any,
  options?: { bubbles?: boolean; cancelable?: boolean; composed?: boolean }
) => {
  const event = new CustomEvent(type, {
    bubbles: options?.bubbles ?? true,
    cancelable: options?.cancelable ?? false,
    composed: options?.composed ?? true,
    detail,
  });
  node.dispatchEvent(event);
  return event;
};
