---
name: engineering-workflow
description: Route nontrivial implementation, bugfixes and refactors by risk and product impact. Use for websites, web apps and bots; skip simple text or style edits.
---

# Engineering workflow

Choose enough process to protect correctness and product quality. Reduce cost
through focused retrieval and less rework; never trade away acceptance quality.
User instructions and existing authorization take precedence over this skill.

## Route

Privately assess complexity, uncertainty, risk and affected surface.

- Trivial: exact source → small edit → relevant cheap check → diff → handoff.
- Standard: current behavior → observable success → short intent plan →
  implementation → affected checks → diff. Keep the task packet in context.
- Complex or uncertain: resolve requirements/design, identify invariants and
  verification, then implement coherent end-to-end slices. Read
  [complex work](references/complex-work.md).
- High risk (auth, money, destructive data, concurrency, public contracts):
  also read [risk and review](references/risk-review.md).

For product-facing work read [product quality](references/product-quality.md).
For existing frontend polish/repair use [frontend-polish](../frontend-polish/SKILL.md).
For new visual direction use [web-director](../web-director/SKILL.md);
creative depth and engineering risk are separate choices.

## Invariants

- Respect applicable project instructions and existing dirty changes.
- Locate current behavior in exact source. Historical memory cannot establish it.
- State the visible outcome, acceptance, preserved behavior, affected consumers,
  uncertainty and required evidence before substantial implementation.
- Reuse existing patterns and platform capabilities. Prefer the simplest working
  engineering (`ponytail` if installed) without reducing the approved product's visual ambition.
- A failed repair requires evidence and a revised hypothesis. After two failed
  attempts, stop stacking patches and inspect the dependency/architecture.
- Use only task-relevant references and tools. No automatic memory calls,
  model changes, API fallback, new dependencies or subagents from this skill.

## Finish

Run the least expensive checks that prove the changed behavior; broaden for
affected dependencies or risk. Existing project checks and the user's testing
constraints apply. For safety-critical behavior, explain a gap rather than
claiming verification from a build alone.

Inspect the relevant final diff for omissions, regressions and unrelated churn.
UI needs rendered evidence, interactions need runtime evidence, and code needs
behavioral evidence appropriate to risk. Report limitations explicitly.
At a handoff use existing project docs for a small checkpoint; write to
long-term memory tools only on explicit user request.

## Portability

Read skills by path if name discovery is unavailable. Use the host's available
file, shell and browser tools. If an essential capability is absent, report the
unverified outcome. This process does not depend on a specific model, agent (Claude Code, Codex,
Cursor), consultant or access to the previous transcript.
