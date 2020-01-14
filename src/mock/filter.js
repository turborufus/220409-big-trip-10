import {FILTER_TYPE} from '../const.js';

const generateFilters = () => {
  const filters = [FILTER_TYPE.ALL, FILTER_TYPE.FUTURE, FILTER_TYPE.PAST];
  return filters;
};

export {generateFilters};
