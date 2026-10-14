/** The one special transition: a sun swallowed by a black disc, ringed in crimson. */
export function EclipseWipe() {
  return (
    <div className="eclipse-wipe" aria-hidden="true">
      <div className="eclipse-wipe__sun" />
      <div className="eclipse-wipe__moon" />
    </div>
  );
}
