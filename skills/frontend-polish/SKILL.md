---
name: frontend-polish
description: Use after substantial frontend implementation or repair to compare raster references, localize visual regressions, inspect browser geometry and states, and iteratively fix defects before final visual-qa. Covers Playwright MCP, visual regression, responsive and component testing evidence; skip low-risk literal/text edits.
---

# Frontend Polish

Improve implementation against approved intent, then hand evidence to final
`visual-qa`. One main agent works inline. This is not art direction, a new test
framework, or a second geometry/interaction methodology.

## Contract First

Read the project rules and relevant design/interaction/acceptance decisions.
State route, UI state, reference, preserved properties and affected consumers.
Raster PNG/JPEG/WebP and approved browser screenshots are first-class inputs;
Figma is not required. Never infer current implementation from memory.

Record reference intent in existing project docs, per region only when necessary:

| Intent | Authority |
|---|---|
| reference | Direction only; pixel diff is diagnostic, not acceptance |
| structural | Composition, hierarchy, proportions and explicit relationships |
| perceptual | Agreed visual closeness; comparator plus local/perceptual review |
| strict | Approved browser golden under matched conditions; changes are regressions |

AI raster artifacts, pseudo-text and impossible effects do not override real
content, accessibility or behavior. A generated concept is not a strict golden.
Changing intent requires an explicit decision, not a failed comparison.

## Tools by Role

| Need | Route |
|---|---|
| Repeated UI inspection, click, fill, resize, state, screenshot | Official Playwright MCP, persistent within the session |
| Repeatable captures, flow assertions and regressions | Project Playwright Test or deterministic scripts |
| Compare reference/actual and localize pixels | Image diff: Playwright `toHaveScreenshot`, pixelmatch or looks-same |
| Model spatial relationships / diagnose anchor drift | `responsive-geometry`, unchanged canonical model |
| Understand states/transitions/fallback | `interaction-concept`, existing behavioral contract |
| Why runtime/network/performance fails | Chrome DevTools MCP; not a second UI controller |
| Isolated reusable component states | Storybook only when the project qualifies |
| Final perceptual acceptance | `visual-qa`, then human taste/product approval |

Read [evidence and comparison](references/evidence.md) for capture, comparison, packets,
coverage and Storybook decisions.
MCP replaces interactive CLI friction, not deterministic checks or tool approval.
If MCP is unavailable, use the existing CLI/script fallback and report the gap;
do not silently install/download tools or upgrade a customer's dependencies.

## Convergence Loop

1. Inspect the affected page/sections and meaningful states at selected sizes.
   Wait for actual app readiness, fonts and images; record render conditions.
2. Capture repeatably. Compare the correct reference/state/viewport, then inspect
   local reference/actual/diff crops. A low global diffRatio does not prove quality.
3. Collect failures with severity, expected contract, actual browser evidence,
   region/selector, reproduction and source candidates. Facts and hypotheses differ.
4. Group by root cause. Check affected consumers; make the smallest structural fix.
   No unrelated redesign or effect additions. Geometry concerns route to
   `responsive-geometry`, not a new offsets/coordinate framework.
5. Rerun affected checks first. Continue useful fix/rerender cycles while failures
   decrease without new regressions. No universal one/two-iteration budget.
6. After local convergence, run the broader scoped responsive/state/behavior suite,
   inspect untouched neighbors, and enter bounded final `visual-qa`.

Two failed repairs of the same defect, unchanged severity, oscillation, a new
major regression, or accumulating magic offsets: STOP that patching strategy.
Revisit root cause using engineering-workflow and the relevant geometry or
interaction contract. An invalid contract goes back to design, not silent repair.
Escalate a focused question when stuck. Carry failure history across final-QA
returns; restarting the gate must not reset stall detection.

Batch meaningful corrections. Do not run screenshot → margin +2px → screenshot
indefinitely. A deliberate strict-fidelity pass is allowed; iteration count is
not a quality metric. Stop when acceptance is met, not when the work merely compiles.

## Integrity and Stop

- Original references/goldens and approved acceptance/coverage are read-only during
  implementation. Baseline changes are separate reviewed operations. Hashes detect
  changes, not OS isolation from a writer with the same filesystem permissions.
- No auto-update snapshots, skipped tests/states, weakened assertions/tolerance,
  unjustified masks, hidden broken elements, or strict → reference switching for green.
- Do not replace relationship-correct layout with magic offsets for pixel similarity.
  Percentages, absolute positioning, transforms and viewport units are not inherently bad.
- Targeted automated protection belongs to implementation/repair where it proves
  changed behavior, critical flows or regression risks. Not every acceptance item
  becomes a test. DOM/text assertions never replace viewing the composition.
- Applicable build/typecheck/lint, behavior/E2E, responsive/state, geometry,
  runtime/console, accessibility and performance checks must pass on the latest code.
  Missing mandatory evidence is BLOCKED, unresolved violations are FAIL, not PASS.
- Machine checks do not certify taste or WCAG compliance. Preserve human review for
  optical alignment, rhythm, intentional asymmetry and product/art-direction fit.

Handoff: scope/intent, changed files, check results, immutable reference IDs,
packets/artifact paths, remaining failures and next step. Use existing project
checkpoint docs; temporary captures/traces go to ignored artifacts, not durable docs.
Do not store in long-term memory tools without an explicit request.
