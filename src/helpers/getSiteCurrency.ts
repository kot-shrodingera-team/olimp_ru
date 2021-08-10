import isClone from './isClone';

const getSiteCurrency = (): string => {
  if (isClone()) {
    return 'Unknown';
  }
  return 'RUR';
};

export default getSiteCurrency;
