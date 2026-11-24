# Evidence and Comparison

## Capture Contract

Use the project's runner and scripts. Record URL/state, viewport including height,
browser/version, DPR, scroll, locale/timezone, data/clock seed, fonts/images ready,
color scheme and motion preference. Avoid arbitrary sleeps and network-idle as
the sole readiness signal. Stabilize only the capture; test actual motion,
transitions and reduced-motion behavior separately.

Interactive MCP contexts preserve state within the session. Deterministic tests
must use fresh contexts plus explicit state setup, not those cookies or prior clicks.
No production credentials in a test profile or artifact. Network/console traces
may contain secrets even when headers are redacted; inspect before sharing.

Playwright MCP: prefer bounded accessibility snapshots of the relevant region and
element boxes over whole-page dumps; read the live tool schema first. Do not treat
a text snapshot as evidence that pixels or contrast are correct.

For deterministic scripts capture one viewport at CSS scale plus the boxes and
computed styles of the few selectors that matter. Wait for fonts and images,
choose and pause a meaningful animation state explicitly, and test live motion
separately rather than hiding it from acceptance.

For scrolling pages inspect all affected sections, not only above the fold.
Sticky/fixed layouts require relevant scroll positions. Compare matching viewport,
section and state references; missing reference is an explicit gap, not permission
to generate a new accepted baseline.

## Local Comparison

Use one comparator the project already has, or add a small one:
Playwright `expect(page).toHaveScreenshot()` (runner integration, goldens,
artifacts), `pixelmatch` (pixel count + diff image) or `looks-same`
(native clusters of differing regions).

- Compare images of equal size, same viewport, DPR, state and color scheme;
  never resize to make a comparison pass.
- Write outputs to a new directory; never overwrite inputs or goldens.
- A diff outcome is a comparison result, not product approval. For
  reference/structural intent, triage differences against the contract.
- Strict goldens: no anti-aliasing exclusion and no color tolerance. Non-strict
  tolerance needs an explained policy decision; there is no universal
  "under 2% is fine" rule.
- Keep the full report, but look at local crops of the differing regions:
  a low global diff ratio does not prove quality.
- Pin the browser/version for strict comparisons and keep input hashes.

## Failure Packet

Associate each differing region with the DOM boxes it intersects. Spatial overlap
is a source-locator hypothesis, not proof of ownership or a replacement for exact
source inspection. Add only task-relevant facts:

```text
FAIL hero-media-position / MAJOR / home/default / 900x1000
reference, actual, diff crop paths + full report path
expected: media right edge aligned with hero container right edge
actual: 52 CSS px beyond container; document 928px wide at viewport 900
DOM: [data-ui="hero"], [data-ui="hero-media"]
computed: grid parent; media transform matrix(..., 52, 0)
likely source: repair.css (confirmed selector), hypothesis: compensating offset
reproduce: project test command + browser/state/viewport conditions
```

Pixel clusters cannot assign product severity automatically. Preserve the full
report and unresolved findings. For behavior/runtime failures include assertion,
expected/actual, stderr, stack and exit code. Do not send giant screenshots or
sensitive traces to other tools when a local crop and source fragment suffice.

## Coverage and Storybook

Select a risk-sized matrix, not just mobile/desktop and not every possible combination.
For substantial responsive pages consider 375/430/768/1024/1366/1440/1920, adapted to
actual breakpoints/references. Check just below/on/above meaningful breakpoints,
continuous-layout intermediate widths, max-width changes and sensitive landscape.
Geometry invariants come from `responsive-geometry`, not copied coordinates.

Applicable states: default, loading/skeleton, empty, error, validation, long/short
content, navigation/modal open, hover/focus/keyboard, auth/permissions, server
failure and slow response. Check critical combinations; document exclusions.
Include overflow, crop/wrapping/section boundaries, focus visibility, target sizes,
semantics and deterministic contrast checks where available. Performance diagnosis
uses DevTools traces or Lighthouse, never guessed FPS/CWV.

Storybook is opt-in, not an installation step of polish:

- Usually unnecessary for a simple Astro/static marketing site.
- Consider for substantial React/Vue islands or hard-to-reproduce component states.
- Prefer for component-rich dashboards/admins, reusable forms/tables/modals and design systems.

Check current framework support first (for example, Astro islands in Storybook
do not test Astro hydration/navigation). Keep page E2E as well.
Use meaningful default/loading/empty/error/validation/long/open stories and the
project's supported interaction/browser/a11y tests. Local captures may reuse the
shared comparator; no automatic Chromatic/SaaS. No suitable use case means no install.
