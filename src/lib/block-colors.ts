/**
 * A small rotating palette used to give feature/use-case grids and
 * category tags visual variety instead of repeating one accent color.
 * Tokens are defined in globals.css under --block-*.
 */
export const blockColors = [
  { bg: "bg-block-violet-bg", fg: "text-block-violet-fg" },
  { bg: "bg-block-sky-bg", fg: "text-block-sky-fg" },
  { bg: "bg-block-emerald-bg", fg: "text-block-emerald-fg" },
  { bg: "bg-block-rose-bg", fg: "text-block-rose-fg" },
  { bg: "bg-block-amber-bg", fg: "text-block-amber-fg" },
  { bg: "bg-block-purple-bg", fg: "text-block-purple-fg" },
] as const;

export function getBlockColor(index: number) {
  return blockColors[index % blockColors.length];
}

/** Deterministic color for a label (e.g. a blog category) so the same
 * label always gets the same block color without a hand-maintained map. */
export function getBlockColorForLabel(label: string) {
  const hash = [...label].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return getBlockColor(hash);
}
