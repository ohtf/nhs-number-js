// SPDX-FileCopyrightText: 2026 Open Health Technology Foundation contributors
// SPDX-License-Identifier: MIT

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import * as api from '@ohtf/nhs-number-js';

const { RANGES, calculateChecksum, calculateChecksumMod10, isValid, regionOf, standardiseFormat } = api;

test('require() and import load the same public API', () => {
  const require = createRequire(import.meta.url);
  assert.equal(require('@ohtf/nhs-number-js'), api);
  assert.deepEqual(Object.keys(api).sort(), [
    'RANGES', 'calculateChecksum', 'calculateChecksumMod10', 'isValid', 'regionOf', 'standardiseFormat',
  ]);
});

test('unparseable JavaScript inputs are rejected without coercion', () => {
  const cannotCoerce = { toString() { throw new Error('do not coerce'); } };
  for (const input of [undefined, null, true, [], {}, cannotCoerce, Symbol(), 1n, NaN, Infinity, 0.5]) {
    assert.equal(standardiseFormat(input), '');
    assert.equal(isValid(input), false);
    assert.equal(regionOf(input), null);
    assert.equal(calculateChecksum(input), null);
    assert.equal(calculateChecksumMod10(input), null);
  }
});

test('ASCII digits and consistent separators are required', () => {
  assert.equal(standardiseFormat('９８７６５４３２１０'), '');
  assert.equal(standardiseFormat('987\t654\t3210'), '');
  assert.equal(standardiseFormat('987  654  3210'), '');
  assert.equal(standardiseFormat('987-654 3210'), '');
  assert.equal(calculateChecksum('12345678x'), null);
  assert.equal(calculateChecksumMod10('123456789\n'), null);
});

test('known regions include both endpoints and exclude neighbours', () => {
  for (const { start, end, region } of Object.values(RANGES)) {
    if (region === null) continue;
    assert.equal(regionOf(start), region);
    assert.equal(regionOf(end), region);
    assert.notEqual(regionOf(start - 1), region);
    assert.notEqual(regionOf(end + 1), region);
  }
  assert.equal(regionOf(RANGES.FULL.start - 1), null);
  assert.equal(regionOf(RANGES.FULL.end + 1), null);
});

test('region lookup does not check the checksum or CHI date', () => {
  assert.equal(isValid('987-654-3211'), false);
  assert.equal(regionOf('987-654-3211'), 'SYNTHETIC');
  assert.equal(regionOf('0100000000'), 'SCOTLAND');
  assert.equal(isValid('0100000000'), false);
});

test('CHI dates use the reference leap-year and century rules', () => {
  for (const [date, valid] of [['290200', true], ['290268', true], ['290201', false], ['300200', false]]) {
    // Construct a checksum-valid input from a calendar edge case, not a patient record.
    const identifier = `${date}999`;
    const digit = calculateChecksumMod10(identifier);
    assert.equal(isValid(`${identifier}${digit}`), valid);
  }
});

test('a modulus 11 result of 10 never matches a check digit', () => {
  assert.equal(calculateChecksum('000000006'), 10);
  for (let digit = 0; digit <= 9; digit++) assert.equal(isValid(`000000006${digit}`), false);
});

test('malformed or unrecognised options cannot relax validation', () => {
  for (const options of [
    null, [], 'SCOTLAND', { forRegion: null }, { forRegion: 'WALES' },
    { checkMod10: 'true' }, { for_region: 'SCOTLAND' },
  ]) {
    assert.equal(isValid('9876543210', options), false);
  }
});

test('callers cannot mutate the validation boundaries', () => {
  assert.throws(() => { RANGES.SCOTLAND.end = 0; }, TypeError);
  assert.throws(() => { delete RANGES.SCOTLAND; }, TypeError);
});
