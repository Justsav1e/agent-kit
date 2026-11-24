---
name: visual-qa
description: Use after frontend implementation/polish has converged for bounded final visual acceptance across relevant viewports and states. Return unresolved failures to frontend-polish; not an iterative convergence engine.
---

# Visual QA

## Role

Perform a **bounded visual verification pass** on implemented frontend work.

Find perceptually important defects, fix them in batches, confirm the result, then stop.

This skill is not an art-direction phase and must not silently redesign approved work.

Substantial raster comparison, localized failures and iterative repair belong to
[`frontend-polish`](../frontend-polish/SKILL.md) BEFORE this gate. Preserve this
gate's bounded nature; it must not become a second convergence engine.

**Core rule:** inspect broadly, fix in batches, verify once.

## When to Use

Use when:

- a page or major section is implemented;
- responsive work needs verification;
- an interaction is ready for visual inspection;
- implementation should be compared against approved design intent;
- the user asks to polish, review, inspect, QA, or check the finished frontend;
- acceptance criteria require visual validation.

Do not use:

- before there is meaningful rendered UI;
- to invent the initial visual direction;
- for every tiny component edit;
- as an excuse to repeatedly tweak subjective details with no acceptance impact.

## Inputs

Use the nearest available truth:

1. rendered implementation;
2. `docs/acceptance.md`;
3. `docs/design.md`;
4. `docs/interaction.md`;
5. project `AGENTS.md`;
6. approved references when relevant.

Do not treat an old screenshot as more authoritative than a newer approved project decision.

## Default Viewports

Unless the project defines different targets, inspect approximately:

```text
desktop: 1440px
tablet:   768px
mobile:   375px
```

Use the project's risk-selected viewport/state matrix and preceding polish evidence.
The three defaults are not a coverage ceiling. Include continuous-layout intermediate
widths, significant breakpoint neighbors and wide/max-width behavior when relevant.

Do not create a giant viewport matrix by default.

## QA Loop

### Pass 1 — Inspect

Open all target sizes before changing code.

Inspect the page as a whole first, then major sections.

Collect defects into one short list.

Do not immediately fix the first thing you notice.

### Pass 2 — Prioritize

Classify findings:

```text
BLOCKING
breaks use, meaning, interaction, responsive behavior, or acceptance

MAJOR
visibly damages composition, hierarchy, geometry, readability, or polish

MINOR
small cosmetic difference with little perceptual impact
```

Fix BLOCKING and MAJOR issues.

Fix MINOR issues only when they are obvious, cheap, and clearly improve the result.

### Pass 3 — Batch Fix

Group related defects and fix them together.

Examples:

- responsive geometry;
- typography;
- spacing/hierarchy;
- overflow;
- interaction state;
- motion;
- contrast.

Avoid screenshot → one tiny edit → screenshot loops.

### Pass 4 — Confirm

Recheck the affected target sizes once.

Confirm:

- reported defects are actually resolved;
- no obvious regression was introduced;
- acceptance still holds.

If acceptance holds and no required defect remains, report PASS and stop this gate.
Otherwise report FAIL/BLOCKED and return a localized packet to `frontend-polish`
or diagnosis. After repair, enter a fresh bounded gate; preserve stall/failure history.

## What to Inspect

### Composition

Check:

- clear focal point;
- intentional balance;
- section rhythm;
- visual density;
- dead space;
- cropping;
- alignment;
- whether secondary elements compete with the primary idea.

Do not reduce rich compositions merely to satisfy arbitrary element counts.

Judge perceptual hierarchy.

### Responsive Behavior

Check:

- layout recomposes intentionally;
- content order remains sensible;
- no horizontal overflow;
- important content remains reachable;
- text widths remain readable;
- touch targets remain usable;
- desktop assumptions are not blindly scaled down.

When relational geometry drifts, use `responsive-geometry` rather than accumulating breakpoint patches.

### Geometry

For complex scenes check:

- anchors;
- shared edges;
- masks/reveals;
- overlays;
- hidden/visible layer alignment;
- target positions;
- interactive bounds;
- object relationships across viewport sizes.

Look for drift, not microscopic coordinate differences.

### Typography

Check:

- hierarchy;
- line length;
- wrapping;
- orphaned words when visually harmful;
- scale relationships;
- weight contrast;
- cramped labels;
- collisions;
- responsive type behavior.

Do not normalize expressive typography into generic UI typography without a concrete readability problem.

### Interaction

Check meaningful states from `docs/interaction.md`.

Verify where relevant:

- idle;
- active;
- hover/focus;
- drag/scroll response;
- progress feedback;
- success/end state;
- persistence/reversibility;
- touch behavior;
- reduced motion.

Do not exhaustively test every implementation branch if automated tests already cover behavior; focus on visible experience.

### Motion

Check:

- motion supports hierarchy or feedback;
- transitions do not fight each other;
- timing feels intentional;
- scroll-linked effects remain stable;
- no obvious jank;
- no accidental layout shift;
- reduced-motion behavior preserves meaning.

Do not tweak easing indefinitely based on tiny subjective differences.

### Readability & Accessibility

Visually check:

- contrast;
- legibility over imagery/backgrounds;
- focus visibility where relevant;
- usable target sizes;
- essential state not communicated by color alone;
- content remains understandable without fragile animation.

Use dedicated automated accessibility tooling when deeper compliance verification is required.

### AI-Slop / Generic Patterns

Check whether implementation accidentally drifted into generic generated-design habits:

- arbitrary glass panels;
- cyan/purple neon without concept;
- excessive rounded cards;
- decorative gradients with no role;
- meaningless floating blobs;
- fake metrics;
- redundant badges;
- repetitive section templates;
- default dashboard/SaaS composition;
- motion added only because animation tooling exists.

Do not reject a pattern merely because it is common.
Reject it when it weakens the project's specific visual language.

## Tools

Use the browser tools that are actually connected:

```text
Playwright MCP (or the agent's browser tool) for interactive inspection
Playwright Test/scripts for reproducible evidence
an image diff (toHaveScreenshot, pixelmatch, looks-same) for reference/actual comparison
Chrome DevTools MCP only for distinct browser diagnosis
```

Use screenshots when pixels matter — that is what this pass is for, and polishing
design from screenshots is expected.

Use DOM inspection when structure matters.

Testing policy is canonical in `AGENTS.md`. Rerun affected behavioral checks after
any fix. If required automated protection is missing, return that work to the
implementation/polish phase instead of waiving it or building a new suite in this
final gate. Text/DOM assertions do not replace looking at composition; human
visual/product approval supplements, not replaces, machine QA.

When the human points at a specific rendered problem, start from that element and state.

Do not add another browser-control system for QA.

## Reporting Findings

Keep findings short and actionable.

Prefer:

```text
[MAJOR] Mobile hero — CTA overlaps the foreground object at 375px.
[MAJOR] Tablet — hidden arc drifts ~one object width from its shared anchor.
[MINOR] Desktop — secondary caption is visually too close to body text.
```

Avoid long design essays during QA.

If no meaningful defects exist, say so and stop.

## Acceptance Boundary

Visual QA verifies approved intent.

It may fix implementation defects directly.

It must NOT silently change:

- product positioning;
- core page structure;
- approved visual concept;
- primary interaction thesis;
- brand direction.

If inspection reveals that the approved concept itself is wrong, report the problem and route back to the appropriate design/concept phase instead of redesigning during QA.

## Hard Rules

- Inspect all target viewports before beginning fixes.
- Major defects > microscopic fidelity.
- Batch related changes.
- Prefer perceptual correctness over arbitrary pixel matching.
- Do not reopen settled art direction without evidence.
- Do not accumulate magic-number responsive patches.
- Do not add new effects during final QA merely because they might look interesting.
- Do not continue polishing after acceptance is satisfied.
- Never create an endless screenshot-tweak loop.
- Missing targeted tests route to implementation/polish, not to an automatic PASS.
- Hand passing evidence to the human; unresolved acceptance returns FAIL/BLOCKED.

## Stop Condition

Visual QA is complete when:

- target viewports have been inspected;
- blocking, major and other acceptance-required defects are resolved;
- responsive relationships remain intentional;
- key interaction states visually hold;
- no obvious regression remains;
- acceptance criteria are satisfied;
- one confirmation pass has completed.

Then report PASS and STOP. An explicitly reported unresolved required defect is
FAIL, not completion; an unavailable required check is BLOCKED.

Further subjective polish requires a new explicit request.
