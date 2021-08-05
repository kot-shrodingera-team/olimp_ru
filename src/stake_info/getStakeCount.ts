import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';
import isClone from '../isClone';

const getStakeCount = (() => {
  if (isClone()) {
    return getStakeCountGenerator({
      stakeElementSelector: '.singles .item',
    });
  }
  return getStakeCountGenerator({
    stakeElementSelector: '[class*="bet-card-wrap__BetCardWrap-"]',
  });
})();

export default getStakeCount;
