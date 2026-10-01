# P3B node-frame assets

This folder stores deterministic screenshots of the P3B CSS/SVG component, not nine independent frame PNGs. The same 48×48 test placeholder is used in every state. These are review artifacts; the reusable source of truth is `apps/web/src/KnowledgeNodeFrame.tsx` and `apps/web/src/knowledge-node-frame.css`.

The browser test `tests/e2e/phase3b-frames.spec.ts` regenerates the comparison board and graph preview screenshots after `pnpm build`.
