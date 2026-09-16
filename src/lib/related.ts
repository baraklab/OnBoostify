/**
 * Deterministic "related items" helpers shared by /blog and /features. Both are
 * pure functions of the data + the current slug — no randomness — so results
 * never change on reload, but differ from item to item.
 */

/** Same-type related: a circular window of `count` items starting right after
 * `currentIndex`, wrapping around the list. */
export function circularRelated<T>(list: T[], currentIndex: number, count: number): T[] {
  if (list.length <= 1) return [];
  const n = Math.min(count, list.length - 1);
  const result: T[] = [];
  for (let i = 1; i <= n; i++) {
    result.push(list[(currentIndex + i) % list.length]);
  }
  return result;
}

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

/** Cross-type related: `count` consecutive items from `list`, starting at an
 * index derived by hashing `seed` (the current page's own slug). */
export function relatedByHash<T>(list: T[], seed: string, count: number): T[] {
  if (list.length === 0) return [];
  const n = Math.min(count, list.length);
  const start = hashString(seed) % list.length;
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(list[(start + i) % list.length]);
  }
  return result;
}
