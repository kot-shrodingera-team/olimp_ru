import getCurrentSumGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getCurrentSum';
import isClone from '../isClone';

const getCurrentSum = (() => {
  if (isClone()) {
    return getCurrentSumGenerator({
      sumInput: 'input.stakeInput',
      // zeroValues: [],
      // currentSumRegex: null,
    });
  }
  return getCurrentSumGenerator({
    sumInput:
      '[class*="bet-card-wrap__BetCardWrap-"] input.number-light__Input-sc-1kxvi0w-1',
    // zeroValues: [],
    // currentSumRegex: null,
  });
})();

export default getCurrentSum;
