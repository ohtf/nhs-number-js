// SPDX-FileCopyrightText: 2026 Open Health Technology Foundation contributors
// SPDX-License-Identifier: MIT

import { RANGES, isValid, regionOf, type Region, type ValidationOptions } from '@ohtf/nhs-number-js';

const region: Region | null = regionOf('987 654 3210');
const options: ValidationOptions = { forRegion: region ?? 'SYNTHETIC', checkMod10: false };
export const valid: boolean = isValid('987 654 3210', options);

// @ts-expect-error Wales does not have a separate region name.
isValid('987 654 3210', { forRegion: 'WALES' });
// @ts-expect-error Range boundaries are read-only.
RANGES.SCOTLAND.end = 0;
