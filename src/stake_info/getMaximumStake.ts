import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getStakeInfoValue';
import { StakeInfoValueOptions } from '@kot-shrodingera-team/germes-generators/stake_info/types';
// import getBalance from './getBalance';
import { log } from '@kot-shrodingera-team/germes-utils';
import { OlimpCloneBet } from '../bookmakerApi';
import getBet from '../helpers/getBet';
import isClone from '../helpers/isClone';

export const maximumStakeSelector = isClone()
  ? ''
  : '[class*="bet-card-wrap__BetCardWrap-"] [class*="single__InfoMax-"]:nth-child(5), .sticky-column:last-child > :nth-child(1) > :nth-child(1) .align-baseline ~ :last-child > :nth-child(3) > :nth-child(1)';

const maximumStakeOptions: StakeInfoValueOptions = {
  name: 'maximumStake',
  ...(isClone()
    ? {
        fixedValue: () => {
          const bet = getBet() as OlimpCloneBet;
          if (!bet) {
            log(
              'Не найдена максимальная ставка (ставка не найдена)',
              'crimson'
            );
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
        },
      }
    : {
        valueFromText: {
          text: {
            // getText: () => '',
            selector: maximumStakeSelector,
            // context: () => document,
          },
          // replaceDataArray: [
          //   {
          //     searchValue: '',
          //     replaceValue: '',
          //   },
          // ],
          // removeRegex: /[\s,']/g,
          // matchRegex: /(\d+(?:\.\d+)?)/,
          errorValue: 0,
        },
      }),
  // zeroValues: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

const getMaximumStake = getStakeInfoValueGenerator(maximumStakeOptions);

export const maximumStakeReady =
  stakeInfoValueReadyGenerator(maximumStakeOptions);

export default getMaximumStake;
