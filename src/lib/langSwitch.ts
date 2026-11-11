/**
 * Shared state for the 日本語 / EN switch animation. Module-level on
 * purpose: /ja and /en have separate root layouts, so components remount
 * on a switch and component state would be lost.
 */
export type LangDir = 'next' | 'prev';

let pending: LangDir | null = null;

/** Called by the switch just before navigating. */
export function markLangSwitch(dir: LangDir) {
  pending = dir;
}

/** Called once by the new page: the direction to glide in from, if any. */
export function takeLangSwitch(): LangDir | null {
  const d = pending;
  pending = null;
  return d;
}
