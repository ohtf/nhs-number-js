// SPDX-FileCopyrightText: 2026 Open Health Technology Foundation contributors
// SPDX-License-Identifier: MIT

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  RANGES,
  calculateChecksum,
  calculateChecksumMod10,
  isValid,
  regionOf,
  standardiseFormat,
} from '@ohtf/nhs-number-js';

const vectors = JSON.parse(readFileSync(new URL('./nhs_number_cases.json', import.meta.url), 'utf8'));
const compare = {
  calculate_checksum: ({ identifier, checksum }) => [calculateChecksum(identifier), checksum],
  calculate_checksum_mod10: ({ identifier, checksum }) => [calculateChecksumMod10(identifier), checksum],
  standardise: ({ input, output }) => [standardiseFormat(input), output],
  standardise_from_int: ({ input, output }) => [standardiseFormat(input), output],
  is_valid: ({ input, check_mod10, valid }) => [isValid(input, { checkMod10: check_mod10 }), valid],
  is_valid_for_region: ({ input, region, check_mod10, valid }) =>
    [isValid(input, { forRegion: region, checkMod10: check_mod10 }), valid],
  region_of: ({ number, region }) => [regionOf(number), region],
  range_boundaries: ({ range, start, end }) => {
    const actual = RANGES[range];
    return [[actual.start, actual.end], [start, end]];
  },
};

test('the harness covers every conformance section and range', () => {
  assert.deepEqual(Object.keys(vectors).filter((key) => !key.startsWith('_')).sort(), Object.keys(compare).sort());
  assert.deepEqual(vectors.range_boundaries.map(({ range }) => range).sort(), Object.keys(RANGES).sort());
});

for (const [section, evaluate] of Object.entries(compare)) {
  for (const [index, vector] of vectors[section].entries()) {
    test(`${section} ${index + 1}${vector.note ? `: ${vector.note}` : ''}`, () => {
      const [actual, expected] = evaluate(vector);
      assert.deepEqual(actual, expected);
    });
  }
}
