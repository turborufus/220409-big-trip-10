export const TypePlaceholder = {
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
export const TransferTypes = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`];
export const ActivityTypes = [`check-in`, `restaurant`, `sightseeing`];
export const AllTypes = TransferTypes.slice(0).concat(ActivityTypes);

export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const ButtonText = {
  DELETE: `Delete`,
  SAVE: `Save`,
  CANCEL: `Cancel`,
  SAVING: `Saving...`,
  DELETING: `Deleting...`
};

export const MenuTab = {
  DEFAULT: `Table`,
  STATS: `Stats`
};

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};
