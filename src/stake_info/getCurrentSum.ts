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
      '.bet-card-wrap__BetCardWrap-muhxrm-0 input.number-light__Input-sc-1kxvi0w-1',
    // zeroValues: [],
    // currentSumRegex: null,
  });
})();

export default getCurrentSum;
