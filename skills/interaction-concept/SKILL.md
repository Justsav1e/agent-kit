---
name: interaction-concept
description: Use when a web experience depends on non-trivial interaction, motion, scroll, pointer behavior, spatial state, or visual transitions that cannot be specified reliably by a static layout alone.
---

# Interaction Concept

## Role

Turn an interaction-heavy design idea into an implementable behavioral contract before production implementation.

This skill defines **what the experience does and how it responds**.

It does not choose the visual style, write production code, or replace general design exploration.

**Core rule:** behavior must be understandable without relying on animation vibes.

## When to Use

Use for interactions such as:

- draggable or movable objects;
- cursor/pointer-reactive scenes;
- scrollytelling;
- masks and reveals;
- spatial exploration;
- progressive discovery;
- stateful hero interactions;
- geometry that changes with user input;
- unusual navigation;
- interactions whose purpose is unclear from a static screenshot.

Do not use for:

- normal hover/focus states;
- ordinary accordions, tabs, menus, forms;
- simple entrance animations;
- standard responsive layout;
- motion that is purely decorative and already understood.

## Start With the Interaction Thesis

State the interaction in one sentence:

> The user **does X** to **change/reveal Y**, which communicates **Z**.

If that sentence is weak or purely decorative, the interaction is not ready.

Example:

> The user moves an optical field across unresolved geometry to reveal the hidden signal structure, turning “searching for a signal” into the literal page interaction.

## Define the Contract

Document only the dimensions that matter.

### Trigger

What begins the interaction?

Examples:

- pointer movement;
- drag;
- scroll position;
- click/tap;
- proximity;
- viewport entry;
- elapsed time.

### States

Name the meaningful states.

Prefer a small explicit state model over vague continuous behavior.

Example:

```text
idle
searching
near-target
resolved
```

Do not create states that exist only because the animation library exposes them.

### Transition

For each important state change, define:

```text
FROM → TO
trigger
visible response
duration/physical character if important
interruptibility
```

Specify motion character only when it affects the experience:

- snappy;
- inertial;
- damped;
- delayed;
- continuous;
- locked;
- reversible.

Do not prescribe arbitrary easing curves before they matter.

### Spatial Relationships

Define what moves relative to what.

Clarify:

- viewport-relative;
- container-relative;
- pointer-relative;
- local scene coordinates;
- shared anchor;
- constrained path;
- fixed vs moving layers.

If geometry is non-trivial, delegate implementation structure to `responsive-geometry`.

### User Feedback

The user should be able to tell:

- what can be manipulated;
- whether their action is having an effect;
- whether they are moving toward or away from success;
- whether the interaction has completed.

Feedback may be visual, spatial, typographic, or state-based.

Do not depend on hidden rules the user cannot infer.

### Success / End State

Define what “done” means.

Answer:

- What changes?
- Does the state persist?
- Can it be reversed?
- What action becomes available afterward?
- Does the user need to achieve pixel-perfect precision?

Prefer forgiving completion thresholds.

### Fallback

Define useful behavior when:

- JavaScript fails;
- pointer precision is unavailable;
- the device is touch-first;
- performance is insufficient;
- the interaction is skipped.

The page must retain its core meaning.

### Responsive Behavior

Do not merely scale desktop interaction down.

Decide whether smaller screens:

- preserve the same mechanic;
- simplify it;
- remap input;
- change composition;
- replace the interaction with another equivalent behavior.

Preserve the **idea**, not necessarily the exact gesture.

### Reduced Motion

Define the semantic equivalent under `prefers-reduced-motion`.

Do not simply disable everything if doing so removes meaning or access.

Prefer:

- instant state changes;
- reduced travel;
- opacity/state substitution;
- user-triggered transitions.

### Performance Budget

Identify likely expensive work before implementation.

Watch for:

- large continuously animated DOM trees;
- forced layout in pointer/scroll loops;
- large filters/blurs;
- expensive masks;
- unnecessary React state on every frame;
- excessive high-resolution assets.

Prefer transform/opacity and animation-loop-local state where possible.

Do not introduce Three.js, shaders, canvas, physics, or other heavy systems unless the interaction genuinely requires them.

## Prototype Only When Uncertainty Exists

Create a tiny runnable prototype when one of these is unresolved:

- gesture feels wrong;
- geometry is uncertain;
- transition timing materially affects the concept;
- success threshold is unclear;
- touch adaptation is questionable;
- browser performance is uncertain.

Prototype the uncertain behavior only.

Do not build the actual page as the prototype.

Do not promote prototype code unless explicitly approved. Keep unpromoted files
inactive; deletion requires a separate decision under the project rules.

## Durable Output

For substantial interaction work, write or update:

```text
docs/interaction.md
```

Keep it concise.

Recommended structure:

```markdown
# Interaction

## Thesis
...

## States
...

## Input / Trigger
...

## Spatial Model
...

## Transitions
...

## Feedback / Success
...

## Responsive
...

## Reduced Motion
...

## Performance / Fallback
...
```

Do not duplicate visual-system details that belong in `docs/design.md`.

## Hard Rules

- Interaction must serve communication, navigation, comprehension, or emotional intent; novelty alone is insufficient.
- Static visual references must not silently redefine interaction behavior.
- Do not implement production mechanics while core states or spatial relationships remain ambiguous.
- Do not force desktop pointer interactions onto touch devices unchanged.
- Do not require excessive precision from users.
- Do not hide essential content behind successful completion of a fragile interaction.
- Do not choose heavyweight rendering technology before simpler DOM/CSS/SVG approaches are ruled out.
- Keep behavior and visual styling separate enough that either can evolve without rewriting the other.

## Stop Condition

The interaction concept is ready when:

- the thesis is clear;
- meaningful states are named;
- triggers and transitions are unambiguous;
- spatial relationships are understood;
- feedback and success behavior are defined;
- mobile/touch and reduced-motion behavior are decided;
- fallback and major performance risks are known;
- no unresolved behavioral question blocks implementation.
