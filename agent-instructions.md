# Agent instructions

This library standardises and validates NHS-family identifiers and classifies their number ranges. It is not a patient-record service.

## Read first

[README](README.md), [validation contract](spec/standard.md), [conformance fixture](tests/conformance/README.md), [safety notes](SAFETY.md) and [house style](https://github.com/pacharanero/house-style/blob/main/AGENTS.md).

## Invariants

- Keep the core deterministic, free of I/O and free of runtime dependencies. Build JavaScript and declarations from the same TypeScript source.
- Use the Python reference vectors verbatim. Document any intentional compatibility gap. Do not add real patient identifiers to code, fixtures, docs, issues or pull requests.
- A checksum or range match is never evidence of allocation or identity. Keep the safety notes in step with validation changes.

## Workflow

- `npm ci --ignore-scripts` installs the compiler. `s/build` builds the package; `s/test` builds and checks the runtime and declarations.
- Before each commit, run `s/test`, `npm audit`, `reuse lint` and `zizmor --strict-collection .`. CI also checks packaging on the minimum supported Node version and a current LTS release.
- Commit validated work locally with DCO sign-off. No remote is configured yet. When creating one, apply at least the Solo `main` protection baseline before pushing; use the clinical tier before a live patient-facing release. Do not push, publish or post without explicit permission.

## Publicity

- Owner: Open Health Technology Foundation contributors.
- Channel: [openhealthtechnology.org](https://openhealthtechnology.org/), maintained in [ohtf/openhealthtechnology.org-website](https://github.com/ohtf/openhealthtechnology.org-website).
- Major announcements belong on the OHTF website alongside repository communication, after approval.
