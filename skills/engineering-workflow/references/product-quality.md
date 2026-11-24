# Product quality

Verify the actual user journey and only its applicable states: initial,
loading, empty, error, success, disabled, long content and narrow screens.
The user should understand what happened and what to do next after failure.

For websites and web apps preserve approved typography, spacing, composition,
responsive relationships and motion intent. Observe the rendered result;
static code cannot establish visual polish. Use
[frontend polish](../../frontend-polish/SKILL.md) before bounded final
[visual QA](../../visual-qa/SKILL.md). Useful repair iterations are allowed;
do not create another competing loop or bypass stall detection.
A still screenshot cannot establish animation quality.

For bots check the command/conversation path, invalid input, cancellation/back,
timeouts, duplicate updates and retry effects when those states exist.
Do not send live messages to other people without user authorization.
Use local fixtures, a test chat explicitly in scope, or a non-mutating probe.

Quality acceptance includes behavior, appearance where relevant, accessibility
basics, comprehensible copy and absence of placeholders/debug output.
Do not lower the accepted target to fit a token budget. Improve retrieval,
scope control and implementation reuse before reducing verification.

Capture rework, regressions, user corrections, time and model usage when
comparing workflows. Fewer input tokens alone do not establish a better result.
