/**
 * Letter-roll text: each glyph carries a copy of itself one line below (via
 * text-shadow) and slides up on hover of the closest `.roll-host`. Pure CSS.
 */
export function Roll({ text }: { text: string }) {
  return (
    <span className="roll" aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden="true" style={{ ['--i' as string]: i }}>
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  );
}
