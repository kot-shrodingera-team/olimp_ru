import clearCouponGenerator from '@kot-shrodingera-team/germes-generators/show_stake/clearCoupon';
import getStakeCount from '../stake_info/getStakeCount';
// import getMaximumStake from '../stake_info/getMaximumStake';
import isClone from '../isClone';

const apiClear = (): void => {
  if (isClone()) {
    betClear();
  }
};

const clearCoupon = (() => {
  if (isClone()) {
    return clearCouponGenerator({
      getStakeCount,
      apiClear,
      clearSingleSelector: '',
      clearAllSelector: '',
      clearMode: 'all-only',
      // maxUnload: {
      //   getMaximumStake,
      // },
    });
  }
  return clearCouponGenerator({
    getStakeCount,
    // apiClear,
    clearSingleSelector: '',
    clearAllSelector: '.betslip-body__ClearAll-czlbcb-4',
    clearMode: 'all-only',
    // maxUnload: {
    //   getMaximumStake,
    // },
  });
})();

export default clearCoupon;
