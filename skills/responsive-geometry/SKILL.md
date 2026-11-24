---
name: responsive-geometry
description: Use when a frontend contains spatially related elements, interactive scenes, anchored objects, overlays, masks, or complex compositions that drift, misalign, or become fragile across viewport sizes.
---

# Responsive Geometry

## Role

Preserve **spatial relationships** across responsive layouts.

Use explicit geometry only when ordinary CSS layout is no longer sufficient.

**Core rule:** relationship > coordinates.

Do not make desktop coordinates responsive.
Model what objects are related to, then derive their positions from those relationships.

## When to Use

Use when the interface contains:

- interactive or illustrated scenes;
- objects anchored to other objects;
- masks/reveals aligned with hidden content;
- draggable spatial interactions;
- scrollytelling geometry;
- decorative structures whose relative placement matters;
- SVG/DOM layers that must remain aligned;
- compositions where breakpoint patches keep accumulating;
- pointer coordinates that must map into a scene;
- responsive drift between visually related elements.

Typical symptoms:

- many unrelated `vw`, `vh`, `top`, `left`, or magic-number offsets;
- the same geometry duplicated in multiple components;
- desktop works but tablet/mobile slowly drift apart;
- hidden and visible layers approximate each other's positions instead of sharing geometry;
- changing one object requires manually correcting several others.

## When NOT to Use

Do not introduce a geometry model for:

- ordinary cards;
- forms;
- navbars;
- text layouts;
- normal content sections;
- standard responsive grids;
- simple absolute decoration;
- layouts already expressed cleanly with Grid, Flexbox, container queries, or normal CSS positioning.

Prefer native CSS layout first.

Explicit geometry is an escalation, not a default.

## Inputs

Understand:

- which objects are spatially related;
- which object or region is their anchor;
- what must remain invariant;
- what may intentionally recompose;
- whether pointer/scroll input participates;
- which viewport ranges require genuinely different composition.

## Process

### 1. Identify Relationships

Describe relationships before writing coordinates.

Examples:

```text
bit stays centered below drill head
label follows the active layer
hidden arc shares the same anchor as visible arc
lens position is relative to hero scene
target remains inside the right-side field
```

If the relationship cannot be stated clearly, the geometry is not understood yet.

### 2. Choose the Simplest Coordinate Space

Prefer, in order:

1. normal CSS layout;
2. container-relative percentages;
3. local component coordinates;
4. shared logical scene coordinates.

Use viewport coordinates only when the relationship is genuinely viewport-relative.

Never jump directly to a global coordinate system because a scene looks complicated.

### 3. Group Related Geometry

Objects that move or resize together should share an anchor or local coordinate system.

Think:

```text
scene
└── signal-field
    ├── target
    ├── hidden-arc
    ├── glow-fragment
    └── label
```

rather than independently positioning all four against the viewport.

### 4. Establish a Source of Truth

Centralize geometry that multiple layers depend on.

Typical shared values:

- scene dimensions;
- anchor positions;
- target location;
- interaction bounds;
- radii;
- key object sizes;
- thresholds.

Visible and hidden representations of the same structure should derive from the same geometry.

Do not maintain approximate duplicate layouts.

### 5. Map Input Into Local Space

When pointer, drag, or scroll input controls scene geometry, convert input once into the relevant local coordinate space.

Conceptually:

```text
viewport input
→ container bounds
→ normalized/local coordinates
→ scene behavior
```

Do not scatter repeated viewport conversion math across components.

### 6. Separate Geometry From Rendering

Prefer:

```text
geometry/state
→ derived positions
→ rendering
```

over embedding important spatial rules inside unrelated JSX/CSS fragments.

Geometry should be understandable without reading every visual style rule.

### 7. Design Responsive Recompositions Deliberately

Responsive behavior does not always mean proportional scaling.

For each major viewport regime decide:

- preserve;
- compress;
- reposition;
- regroup;
- simplify;
- replace interaction/layout.

Preserve the important **relationship or idea**, not every desktop coordinate.

Mobile may use a different composition while sharing the same semantic geometry.

### 8. Test the Relationships

Check at minimum:

- desktop;
- tablet;
- mobile;
- one intermediate width when geometry is continuous.

Inspect relationships, not isolated pixel values.

Ask:

- Are anchors still correct?
- Do related layers still coincide?
- Does changing viewport size produce drift?
- Are interaction bounds still meaningful?
- Does the composition remain intentional rather than merely fitting?

Use `visual-qa` for the final bounded inspection pass.

## Durable Output

For substantial scene geometry, record the model briefly in:

```text
docs/design.md
```

Recommended section:

```markdown
## Geometry & Responsive Model

### Anchors
...

### Shared Geometry
...

### Coordinate Spaces
...

### Responsive Recompositions
...

### Invariants
...
```

If geometry is part of an interaction contract, reference or update the relevant spatial section in `docs/interaction.md`.

Do not create a separate geometry document unless the project genuinely needs one.

## Hard Rules

- Relationship > coordinates.
- CSS layout before custom geometry.
- Shared structure must use shared geometry.
- Do not duplicate coordinates between visible/hidden states.
- Do not fix structural drift by accumulating breakpoint-specific magic numbers.
- Do not use viewport units as a substitute for understanding the anchor.
- Do not force one coordinate system across unrelated components.
- Keep coordinate conversions at clear boundaries.
- Responsive layouts may deliberately recompose.
- Optimize for understandable relationships, not mathematical sophistication.
- Do not introduce canvas, WebGL, physics, or a scene graph merely to solve ordinary DOM positioning.

## Common Failure Patterns

### Breakpoint Patch Stack

```text
desktop offset
→ tablet correction
→ mobile correction
→ 900px special case
→ 820px special case
```

Fix the relationship or anchor instead.

### Duplicate Hidden Geometry

Visible and hidden layers use separate approximate positions.

Use one geometry source.

### Viewport Everything

Every object uses `vw/vh`.

Move related objects into a shared container/local space.

### Scaling Instead of Designing

The desktop scene is uniformly shrunk for mobile.

Recompose while preserving the concept.

### Geometry Framework Too Early

A normal layout gets a custom coordinate engine.

Delete it and use CSS.

## Stop Condition

Geometry is ready when:

- every important object has a clear spatial reference;
- related layers derive from shared geometry where appropriate;
- coordinate-space boundaries are explicit;
- responsive recompositions are intentional;
- desktop/tablet/mobile preserve the required relationships;
- no major alignment depends on unexplained magic-number patches;
- ordinary CSS is still used everywhere it is sufficient.

Then stop designing the geometry model and proceed with implementation or visual verification.
