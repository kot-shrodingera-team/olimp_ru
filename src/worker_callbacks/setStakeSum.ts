import setStakeSumGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/setStakeSum';
import isClone from '../isClone';

// const preInputCheck = (): boolean => {
//   return true;
// };

const setStakeSum = (() => {
  if (isClone()) {
    return setStakeSumGenerator({
      sumInputSelector: 'input.stakeInput',
      alreadySetCheck: {
        falseOnSumChange: false,
      },
      inputType: 'fireEvent',
      // preInputCheck,
    });
  }
  return setStakeSumGenerator({
    sumInputSelector:
      '[class*="bet-card-wrap__BetCardWrap-"] input.number-light__Input-sc-1kxvi0w-1',
    alreadySetCheck: {
      falseOnSumChange: false,
    },
    inputType: 'react',
    // preInputCheck,
  });
})();

export default setStakeSum;
