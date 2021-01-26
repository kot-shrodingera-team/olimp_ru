import {
  balanceReadyGenerator,
  getBalanceGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getBalance';
import isClone from '../isClone';

export const balanceReady = (() => {
  if (isClone()) {
    return balanceReadyGenerator({
      balanceSelector: '.js-showbalance',
      balanceRegex: null,
    });
  }
  return balanceReadyGenerator({
    balanceSelector: '.user-bars__Balance-sc-18yu4ah-5 span.text',
    // balanceRegex: null,
  });
})();

const getBalance = (() => {
  if (isClone()) {
    return getBalanceGenerator({
      balanceSelector: '.js-showbalance',
      // balanceRegex: null,
    });
  }
  return getBalanceGenerator({
    balanceSelector: '.user-bars__Balance-sc-18yu4ah-5 span.text',
    // balanceRegex: null,
  });
})();

export const updateBalance = (): void => {
  worker.JSBalanceChange(getBalance());
};

export default getBalance;
