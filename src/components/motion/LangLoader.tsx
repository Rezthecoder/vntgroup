import { FlagWordmark } from '@/components/brand/FlagWordmark';

/**
 * Shown while the 日本語 / EN switch builds the other-language page: the VNT
 * wordmark waving (as on the arrival screen) and a thin red→gold bar. Pure
 * CSS: hidden (display: none, no animation cost) until the switch adds
 * .lang-leaving to <html>, and it fades in only after 0.12s so quick
 * switches never flash it. It disappears with the old page.
 */
export function LangLoader() {
  return (
    <div aria-hidden className="lang-loader pointer-events-none fixed inset-0 z-[190] flex-col items-center justify-center">
      <div className="w-[8.5rem] text-brand">
        <FlagWordmark idPrefix="vnt-lang-flag" title="" />
      </div>
      <div className="lang-loader-bar mt-3 h-[2px] w-[7.5rem] overflow-hidden rounded-full bg-ink/10" />
    </div>
  );
}
