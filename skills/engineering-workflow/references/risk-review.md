# Risk and review

Before changing a security boundary, public contract, data lifecycle or
concurrent behavior, identify invariants, failure modes, compatibility,
deployment ordering and recovery. A syntactically valid migration does not
prove data safety. Preserve explicit authorization boundaries.

Use deterministic evidence for critical behavior. If it cannot be obtained
under the user's constraints, state what remains unverified; do not replace it
with confidence. Run broader existing checks when impact crosses boundaries.

For consequential changes use an independent review if available and justified.
Give a fresh reviewer the task/acceptance, relevant constraints, diff or exact
source, checks, known limitations and concerns. Do not pass the implementation
transcript. Keep delegation bounded; do not start recursive reviewers.

Findings need a concrete affected path and failure scenario. Prioritize
correctness, missed requirements, regressions, failure handling, security and
unnecessary complexity. A style preference is not authority for a rewrite.
If review is a separate self-pass, label it accurately rather than independent.
