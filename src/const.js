export const TYPE_PLACEHOLDER = {
  'bus': `Bus to `,
  'check-in': `Check into `,
  'drive': `Drive to `,
  'flight': `Flight to `,
  'restaurant': `Restaurant in `,
  'ship': `Ship to `,
  'sightseeing': `Sightseeing in `,
  'taxi': `Taxi to `,
  'train': `Train to `,
  'transport': `Transport to `
};
export const TRANSFER_TYPES = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`];
export const ACTIVITY_TYPES = [`check-in`, `restaurant`, `sightseeing`];
export const ALL_TYPES = TRANSFER_TYPES.slice(0).concat(ACTIVITY_TYPES);

export const DESTINATIONS = [`Geneva`, `Amsterdam`, `Saint Petersburg`, `Moscow`, `Brugge`];

export const FILTER_TYPE = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};
