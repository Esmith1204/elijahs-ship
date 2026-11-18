/**
 * The "underwater" behind every page. Four quiet layers, all decorative:
 *
 * 1. Depth: the water darkens the further down the page you go (scrolls with the page).
 * 2. Light pools: a few large, blurred patches of color that drift very slowly.
 * 3. Light shafts: faint rays from the surface, swaying.
 * 4. Particles: sparse specks rising slowly through the water.
 *
 * Layers 2 to 4 are fixed to the viewport, so they read as ambient light
 * rather than page content. Only transforms animate (cheap to render), and
 * the global reduced-motion rule in index.css stops them. Styles live in
 * index.css under "Underwater backdrop".
 */
export function UnderwaterBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="uw-depth absolute inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="uw-pool uw-pool-1" />
        <div className="uw-pool uw-pool-2" />
        <div className="uw-pool uw-pool-3" />
        <div className="uw-rays" />
        <div className="uw-particles uw-particles-near" />
        <div className="uw-particles uw-particles-far" />
      </div>
    </div>
  );
}
