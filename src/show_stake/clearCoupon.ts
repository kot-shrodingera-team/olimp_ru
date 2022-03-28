import clearCouponGenerator from '@kot-shrodingera-team/germes-generators/show_stake/clearCoupon';
import getStakeCount from '../stake_info/getStakeCount';
// import getMaximumStake from '../stake_info/getMaximumStake';
import isClone from '../helpers/isClone';

// const preCheck = async (): Promise<boolean> => {
//   return true;
// };

const apiClear = (): void => {
  if (isClone()) {
    window.betClear();
  }
};

// const postCheck = async (): Promise<boolean> => {
//   return true;
// };

const clearCoupon = clearCouponGenerator({
  // preCheck,
  getStakeCount,
  apiClear: isClone() ? apiClear : undefined,
  // clearSingleSelector: '',
  clearAllSelector: isClone()
    ? ''
    : '[class*="betslip-body__ClearAll-"], .sticky-column:last-child > :nth-child(1) > :nth-child(1) > :nth-child(2) > :nth-child(3) > :nth-child(1) > :nth-child(1)',
  // селектор указывает на button или span внутри button, в любом случае click работает
  // postCheck,
  // context: () => document,
});

export default clearCoupon;
