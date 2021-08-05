import getMaximumStakeGenerator, {
  maximumStakeReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getMaximumStake';
import { log } from '@kot-shrodingera-team/germes-utils';
import { OlimpCloneBet } from '../bookmakerApi';
import getBet from '../getBet';
import isClone from '../isClone';

export const maximumStakeReady = (() => {
  if (isClone()) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (timeout = 5000, interval = 100): Promise<boolean> => true;
  }
  return maximumStakeReadyGenerator({
    maximumStakeElementSelector:
      '[class*="bet-card-wrap__BetCardWrap-"] [class*="single__InfoMax-"]:nth-child(5)',
    // maximumStakeRegex: null,
  });
})();

const getMaximumStake = (() => {
  if (isClone()) {
    return () => {
      const bet = getBet() as OlimpCloneBet;
      if (!bet) {
        log('Не найдена максимальная ставка (ставка не найдена)', 'crimson');
        return 0;
      }
      const max = bet.vmaxbet;
      if (!max) {
        log('Не найдена максимальная ставка', 'crimson');
        return 0;
      }
      if (Number.isNaN(max)) {
        log(`Непонятный формат максимальной ставки: "${max}"`, 'crimson');
        return 0;
      }
      return Number(max);
    };
  }
  return getMaximumStakeGenerator({
    maximumStakeElementSelector:
      '[class*="bet-card-wrap__BetCardWrap-"] [class*="single__InfoMax-"]:nth-child(5)',
    maximumStakeRegex: null,
    disableLog: true,
  });
})();

export default getMaximumStake;
