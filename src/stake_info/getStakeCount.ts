import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';
import isClone from '../helpers/isClone';

const getStakeCount = getStakeCountGenerator({
  stakeSelector: isClone()
    ? '.singles .item'
    : '[class*="bet-card-wrap__BetCardWrap-"]',
  // context: () => document,
});

export default getStakeCount;
