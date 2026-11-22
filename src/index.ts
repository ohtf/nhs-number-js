// SPDX-FileCopyrightText: 2026 Open Health Technology Foundation contributors
// SPDX-License-Identifier: MIT

function range<R extends string | null>(start: number, end: number, region: R) {
  return Object.freeze({ start, end, region });
}

/** Inclusive numeric boundaries. FULL spans all named regions. */
export const RANGES = Object.freeze({
  UNALLOCATED_1: range(10, 99_999_999, 'UNALLOCATED'),
  SCOTLAND: range(100_000_000, 3_112_999_999, 'SCOTLAND'),
  UNALLOCATED_2: range(3_113_000_000, 3_199_999_999, 'UNALLOCATED'),
  NORTHERN_IRELAND: range(3_200_000_000, 3_999_999_999, 'NORTHERN_IRELAND'),
  ENGLAND_WALES_IOM_1: range(4_000_000_000, 4_999_999_999, 'ENGLAND_WALES_IOM'),
  RESERVED: range(5_000_000_000, 5_999_999_999, 'RESERVED'),
  ENGLAND_WALES_IOM_2: range(6_000_000_000, 7_999_999_999, 'ENGLAND_WALES_IOM'),
  EIRE: range(8_000_000_000, 8_599_999_999, 'EIRE'),
  UNALLOCATED_3: range(8_600_000_000, 8_999_999_999, 'UNALLOCATED'),
  SYNTHETIC: range(9_000_000_000, 9_999_999_999, 'SYNTHETIC'),
  FULL: range(10, 9_999_999_999, null),
});

export type Region = NonNullable<(typeof RANGES)[keyof typeof RANGES]['region']>;

export interface ValidationOptions {
  /** Require this region as well as a valid checksum. */
  forRegion?: Region;
  /** Accept the alternative CHI check digit. Defaults to true. */
  checkMod10?: boolean;
}

/** Return ten ASCII digits, or an empty string for unparseable input. */
export function standardiseFormat(input: unknown): string {
  if (typeof input === 'number') {
    if (!Number.isInteger(input) || input < 0 || input > RANGES.FULL.end) return '';
    return String(input).padStart(10, '0');
  }
  if (typeof input !== 'string') return '';

  const trimmed = input.trim();
  if (/^[0-9]{10}$/.test(trimmed)) return trimmed;
  if (/^[0-9]{3}([ -])[0-9]{3}\1[0-9]{4}$/.test(trimmed)) {
    return trimmed.replace(/[ -]/g, '');
  }
  return '';
}

function isIdentifier(input: unknown): input is string {
  return typeof input === 'string' && /^[0-9]{9}$/.test(input);
}

/** Modulus 11 check digit for the first nine digits. A result of 10 is unusable. */
export function calculateChecksum(identifier: unknown): number | null {
  if (!isIdentifier(identifier)) return null;

  let sum = 0;
  for (let index = 0; index < identifier.length; index++) {
    sum += (identifier.charCodeAt(index) - 48) * (10 - index);
  }
  return (11 - (sum % 11)) % 11;
}

/** Modulus 10 check digit for the first nine digits of a CHI number. */
export function calculateChecksumMod10(identifier: unknown): number | null {
  if (!isIdentifier(identifier)) return null;

  let sum = 0;
  for (let index = 0; index < identifier.length; index++) {
    const digit = identifier.charCodeAt(index) - 48;
    const weighted = index % 2 === 0 ? digit * 2 : digit;
    sum += weighted > 9 ? weighted - 9 : weighted;
  }
  return (10 - (sum % 10)) % 10;
}

const ranges = Object.values(RANGES).filter(({ region }) => region !== null);

function regionOfStandardised(number: string): Region | null {
  const value = Number(number);
  return ranges.find(({ start, end }) => start <= value && value <= end)?.region ?? null;
}

/** Classify by range, without checking the checksum or CHI date. */
export function regionOf(input: unknown): Region | null {
  const number = standardiseFormat(input);
  return number === '' ? null : regionOfStandardised(number);
}

function hasValidChiDate(number: string): boolean {
  const day = Number(number.slice(0, 2));
  const month = Number(number.slice(2, 4));
  const shortYear = Number(number.slice(4, 6));
  // Match Python's strptime %y pivot. UTC avoids local time-zone rules.
  const year = (shortYear <= 68 ? 2000 : 1900) + shortYear;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** Check format, checksum, CHI date where applicable, and any requested region. */
export function isValid(input: unknown, options: ValidationOptions = {}): boolean {
  const number = standardiseFormat(input);
  if (number === '') return false;

  if (options === null || typeof options !== 'object' || Array.isArray(options)) return false;
  if (Object.keys(options).some((key) => key !== 'forRegion' && key !== 'checkMod10')) return false;
  const { forRegion, checkMod10 = true } = options;
  if (typeof checkMod10 !== 'boolean') return false;

  const region = regionOfStandardised(number);
  if (forRegion !== undefined && (region === null || region !== forRegion)) return false;
  if (region === 'SCOTLAND' && !hasValidChiDate(number)) return false;

  const identifier = number.slice(0, 9);
  const checkDigit = Number(number[9]);
  if (calculateChecksum(identifier) === checkDigit) return true;
  return checkMod10 && region === 'SCOTLAND' && calculateChecksumMod10(identifier) === checkDigit;
}
