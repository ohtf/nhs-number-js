# nhs-number-js

Validate, standardise and classify NHS and Scottish CHI numbers in JavaScript and TypeScript. Early development; not published to npm.

## Quick start

From this checkout, with Node.js 22.13 or newer and Bash:

```sh
npm ci --ignore-scripts
s/build
node --input-type=module -e "import { isValid } from '@ohtf/nhs-number-js'; console.log(isValid('987 654 3210', { forRegion: 'SYNTHETIC' }));"
# true
```

One TypeScript source builds to an ES module (`.js`) and declarations (`.d.ts`). The same `import` works in JavaScript and TypeScript, including browser apps using a bundler. On supported Node versions, JavaScript callers can also use `require('@ohtf/nhs-number-js')`. For another local project, run `npm pack --ignore-scripts` after building, then install the resulting tarball.

## API

| Export | Result |
| --- | --- |
| `standardiseFormat(input)` | Ten ASCII digits or `''` for unparseable input. Accepts ten-digit strings, consistent `3-3-4` groups, and non-negative integers of up to ten digits. Prefer strings to preserve leading zeroes. |
| `isValid(input, options?)` | Checks Modulus 11, plus the encoded calendar date for Scottish CHI numbers. Also accepts Modulus 10 for CHI unless `checkMod10: false`. Set `forRegion` to require a specific region. |
| `regionOf(input)` | A region name or `null`. Classifies by numeric range without validating the checksum or date. |
| `calculateChecksum(identifier)` / `calculateChecksumMod10(identifier)` | Check digit calculated from a nine-digit string, or `null` for invalid input. A Modulus 11 result of `10` cannot be used as a check digit. |
| `RANGES` | Read-only inclusive range boundaries. |

TypeScript also exports `Region` and `ValidationOptions`. Region names are `SCOTLAND`, `NORTHERN_IRELAND`, `ENGLAND_WALES_IOM`, `EIRE`, `RESERVED`, `UNALLOCATED` and `SYNTHETIC`.

**Validation does not verify patient identity or confirm that a number was issued.** It can accept reserved and synthetic numbers. See [safety notes](SAFETY.md) before patient-facing use. Number generation and disguising are outside this library’s scope.

## Development

Run `s/test` after `npm ci --ignore-scripts`. The tests use [the Python library’s unmodified JSON vectors](tests/conformance/README.md) and exercise the JavaScript entry point and TypeScript declarations. See the [validation contract](spec/standard.md) and [contribution guide](CONTRIBUTING.md). The library has no runtime dependencies. TypeScript 6 is the sole dev dependency: it emits JavaScript and declarations without a bundler or platform-specific compiler packages.

## Licence

Code is [MIT](LICENSE). Project documentation is [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt). The MIT-licensed fixture and reference behaviour come from [OHTF’s Python `nhs-number`](https://github.com/ohtf/nhs-number-py); the upstream copyright notice is retained.
