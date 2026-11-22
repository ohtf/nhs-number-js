# Conformance fixture

`nhs_number_cases.json` is a byte-for-byte copy of the shared fixture from [ohtf/nhs-number-py at `36e6a40`](https://github.com/ohtf/nhs-number-py/blob/36e6a40e4b4359454f67b7df0ad16594e6fbf41e/tests/vectors/nhs_number_cases.json). It is MIT licensed; see the upstream notice in [LICENSE](../../LICENSE). Vendoring keeps tests reproducible and runnable without the Python checkout or network access.

Each case compares the built package’s result with the expected value supplied by the Python project. `s/test` exercises all sections: standardisation, both checksum algorithms, validity with and without a region constraint, region lookup and inclusive boundaries. The harness translates snake_case fixture keys to the corresponding JavaScript calls without changing the inputs or expected results.

To update, copy the complete file from a reviewed upstream commit, update the permalink here, inspect the expected-result diff and run `s/test`. Fix incorrect expectations in the Python reference first; do not edit the vendored file by hand.
