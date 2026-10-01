# Function World — Wiki UI Refinement

Updated: 2026-10-01 02:54:01 CST.

## Scope

Implement the project owner's five UI requests at `/function-world`. Keep the frozen 32-node graph, 40 Strong / 11 Weak relations, ontology, evidence, learning rules, and local progress format unchanged. No production deployment.

## Node display recovery

The old node description lived inside a transformed React Flow node, inherited its scale/filter, and could be painted underneath adjacent nodes. Unlock feedback also transformed the outer node wrapper.

The new `WorldHoverCard` is a screen-space overlay outside the transformed node viewport. It follows graph pan/zoom, remains readable at a fixed text size, flips sides at the boundary, and hides when its associated node is offscreen. Node feedback stays on the inner frame instead of transforming the geometry-bearing wrapper. Graph resize observes its actual container and refits the active module or focused node.

## Visual system

User-provided Chinese Minecraft Wiki screenshot is the reference, not instructions from the third-party page. Adapted surfaces:

- Left grouped navigation; seven unchanged mathematical modules also remain accessible as category tabs.
- Central graph workspace and right learning-progress panel.
- Dark blue-gray background/panels, neutral beveled buttons, green selected tabs/progress, pale-blue links.
- Existing original MathCraft icons and nine-state node frames retained.

No Wiki logo, game hero image, terrain texture, or unrelated Wiki content copied. The reference layout is adapted to knowledge exploration rather than replacing existing functionality.

## Typography

Load the owner's `Minecraft.ttf` locally as `KnowledgeMinecraft`. Use it for Function World text, form controls, tooltips, and Detail Drawer. Preserve KaTeX font families and rendering. Font metadata and checksum are recorded in `apps/web/src/assets/fonts/README.md`.

## Floating tools

Zoom controls: top-left inside graph. MiniMap: top-right inside graph. Both remain outside the pan/zoom transform. The MiniMap SVG scales to its container, including the smaller mobile frame. Neither tool is pinned to the page footer.

## Motion integration contract

- CSS duration tokens: `--kw-motion-hover`, `--kw-motion-unlock`, `--kw-motion-toast`, `--kw-motion-edge`, `--kw-motion-edge-delay`.
- Root markers: `data-feedback-token`, `data-feedback-active`; per-node feedback classes remain available.
- Each feedback event uses an increasing token; an old timer cannot clear a newer event.
- Feedback timers are tracked and cleared on component unmount.
- `prefers-reduced-motion` disables/reduces animation. Future animation must preserve this behavior.
- Keep animations on inner visual layers; do not animate graph geometry, tooltip text scale, or mathematical content.
- Unlock status is committed independently of animation completion; motion must not change prerequisites or progress.

This iteration prepares modest future effects, not a new full-screen animation sequence.

## Validation

- `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- `pnpm test tests/unit/function-world-model.test.ts`: 5 passed.
- Browser checks: quick initialization, normal unlock, progress, newly available successors, search, prerequisite path, module navigation, Weak toggle, Detail Drawer, pan/zoom-related tooltip positioning, desktop/narrow layout.
- Loaded UI font: `KnowledgeMinecraft`; sampled formula glyph family: `KaTeX_Math`.
- Browser console: no error entries during checked interactions.
- Evidence: `assets/phase-3/wiki-refinement/desktop.jpg`, `mobile.jpg`; detailed comparison: `design-qa.md`.

Browser checks use the separate in-app browser's local progress, not the user's Chrome progress. No production data was modified.
