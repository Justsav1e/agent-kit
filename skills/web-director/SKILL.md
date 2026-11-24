---
name: web-director
description: Use when starting or resuming a website/frontend task and the agent must decide process depth, relevant skills, or tool routing before doing substantial work.
---

# WEB Director

## Role

Route website/frontend work through the **smallest sufficient process**.

You are not the designer, researcher, planner, or QA system.
Choose the right existing capability, then get out of the way.

**Core rule:** minimum sufficient process > maximum available process.

## Start From Truth

Before routing substantial work, use the nearest durable source:

1. project `AGENTS.md`
2. current project docs such as `docs/design.md`, `docs/interaction.md`, `docs/acceptance.md`
3. existing code
4. long-term memory tools only when the user explicitly requests past experience/history

Do not reconstruct current project state from memory when the project already records it.

## Choose Creative Depth

For explicitly ambitious, award-caliber website execution, read
[premium execution](references/premium-execution.md) after choosing depth.
It connects the creative thesis to a real proof slice and sustained page craft.
Engineering complexity/risk is handled by
[engineering-workflow](../engineering-workflow/SKILL.md); do not repeat its routing.

### DIRECT

Use for:
- bounded fixes
- implementation from an approved design
- ordinary responsive/layout work
- component changes
- technical cleanup

Do not invoke creative exploration just because design skills exist.

### CRAFT

Use when the direction exists but needs stronger execution.

Typical tools:
- `frontend-design-principles`
- `ui-ux-pro-max`
- `impeccable`
- `emil-design-eng`

Load only what the task needs.

### CONCEPT

Use when the visual or interaction direction itself is unresolved.

Typical tools:
- `brainstorming` for scope/intent when needed
- `first-principles` to challenge inherited assumptions
- `frontend-design-principles`
- `grilling` before committing to a consequential concept

Use `brainstorm-diverge-converge` for a quick spread of alternatives.

### OVERDRIVE

Use for intentionally unusual, portfolio-grade, experiential, or highly memorable work where conceptual search is valuable.

Typical tools:
- `first-principles`
- `creative-director`
- `frontend-design-principles`
- `grilling`
- stronger `impeccable` art-direction modes

OVERDRIVE is expensive. Never invoke it merely because the project is visual.

If the user explicitly requests a creative depth, honor it unless it conflicts with an already-approved project state.

## Route Special Problems

- Interaction cannot be explained by a static layout → `interaction-concept`
- Complex scene relationships drift responsively → `responsive-geometry`
- Substantial implementation needs comparison, responsive/state repair or convergence → `frontend-polish`
- Implementation has converged and needs bounded final visual acceptance → `visual-qa`

Do not invoke geometry/interaction modeling for ordinary UI that native CSS and
standard behavior already handle. Polish and final QA depend on visual/product
risk, not on whether the layout required custom geometry.

## Route Information

- current project truth → project files/code
- past decisions or cross-session experience → memory tools, explicitly
- current framework/library API → Context7 MCP (`context7-docs`), else official docs
- broad public discovery → the agent's web search
- read a discovered page → the agent's web fetch
- inspect/interact with rendered UI → Playwright MCP (or the agent's browser tool)
- repeatable capture/assertions → project Playwright Test/scripts
- raster differences/crops → an image diff (Playwright `toHaveScreenshot`, pixelmatch, looks-same)
- browser/network/performance diagnosis → Chrome DevTools MCP

Prefer CLI/scripts for deterministic checks, batch operations and machine-readable QA.
Prefer persistent MCP for repeated interactive inspection, state and browser debugging.
Do not duplicate responsibilities without concrete benefit. Use only tools that are
actually connected; report a missing one instead of improvising. No heavy polish for low-risk literals.

## Hard Rules

- Never load the full creative stack by default.
- Never duplicate another skill's procedure inside this skill.
- Existing approved design beats fresh ideation unless redesign is requested.
- Research only when a decision depends on unknown external facts.
- Do not create documents merely because a workflow can create them.
- Do not turn a small fix into a design exercise.
- Do not let `first-principles` simplify away intentional creative ambition.
- Do not let creative exploration continue after the concept is sufficiently decided.
- Testing policy comes from `AGENTS.md`, not this router. Targeted protection may
  be needed without an existing suite. Human review covers final visual/product approval.

## Stop Condition

Routing is complete when the current task has:

- a known source of truth;
- an appropriate creative depth;
- the minimum necessary skills/tools selected;
- no unresolved decision that blocks the next concrete action.

Then proceed with the selected workflow.
