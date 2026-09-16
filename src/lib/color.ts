/** Darkens a "#rrggbb" color by `amount` (0-1) — used to build a darker gradient
 * partner for a thumbnail/banner frame's background from a single accent color. */
export function darkenHex(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function frameGradient(color: string): string {
  return `linear-gradient(155deg, ${color}, ${darkenHex(color, 0.5)})`;
}
