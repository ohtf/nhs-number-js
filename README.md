# nhs-number-js

Validate, standardise and classify NHS and Scottish CHI numbers in JavaScript and TypeScript. The library is in early development.

## Quick start

Install from [npm](https://www.npmjs.com/package/@ohtf/nhs-number-js):

```sh
npm install @ohtf/nhs-number-js
node --input-type=module -e "import { isValid } from '@ohtf/nhs-number-js'; console.log(isValid('987 654 3210', { forRegion: 'SYNTHETIC' }));"
# true
```

One TypeScript source builds to an ES module (`.js`) and declarations (`.d.ts`). The same `import` works in JavaScript and TypeScript, including browser apps using a bundler. On Node.js 22.13 or newer, JavaScript callers can also use `require('@ohtf/nhs-number-js')`.

## How it compares

Use `nhs-number-js` if you need the same CHI and range checks as [OHTF’s Python library](https://github.com/ohtf/nhs-number-py). In a side-by-side check of the versions below, all three alternatives accepted a CHI number with an impossible date and a matching Modulus 11 digit, and rejected a valid Modulus 10-only CHI number. This library handles both cases, lets you opt out of Modulus 10, and can report or require a region by numeric range. Those behaviours are checked against the [shared Python vectors](tests/conformance/README.md).

| Alternative tested | Where it may fit better |
| --- | --- |
| [`validate-nhs-number` 1.1.1](https://www.npmjs.com/package/validate-nhs-number/v/1.1.1) | Accepts digit arrays and whitespace outside the usual `3-3-4` grouping, while rejecting punctuation. Can be loaded as a classic browser script. |
| [`valid-nhsnum` 1.0.4](https://www.npmjs.com/package/valid-nhsnum/v/1.0.4) | Includes a number generator and accepts more free-form pasted input. It also accepts mixed separators and punctuation that this library deliberately rejects. |
| [`nhs-number-validator` 1.1.2](https://www.npmjs.com/package/nhs-number-validator/v/1.1.2) | Includes an interactive CLI and can be loaded as a classic browser script. It expects an unformatted number. |

All four agreed on the plain ten-digit Modulus 11 examples tested, with a correct and an incorrect check digit. The comparison used published test examples, not patient records. It did not measure speed or bundle size.

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

Run `s/test` after `npm ci --ignore-scripts`. The tests use [the Python library’s unmodified JSON vectors](tests/conformance/README.md) and exercise the JavaScript entry point and TypeScript declarations. See the [validation contract](spec/standard.md), [contribution guide](CONTRIBUTING.md) and [npm release procedure](https://github.com/ohtf/nhs-number-js/blob/main/docs/releases.md). The library has no runtime dependencies. TypeScript 6 is the sole dev dependency: it emits JavaScript and declarations without a bundler or platform-specific compiler packages.

## Licence

Code is [MIT](LICENSE). Project documentation is [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt). The MIT-licensed fixture and reference behaviour come from [OHTF’s Python `nhs-number`](https://github.com/ohtf/nhs-number-py); the upstream copyright notice is retained.
