// import isClone from '../isClone';

// export const minimumStakeReady = (() => {
//   // if (isClone()) {
//   //   return async (timeout = 5000, interval = 100): Promise<boolean> => true;
//   // }
//   return async (timeout = 5000, interval = 100): Promise<boolean> => true;
// })();

const getMinimumStake = (): number => {
  switch (worker.Currency) {
    case 'RUR':
      return 10;
    default:
      return 0;
  }
};

export default getMinimumStake;
