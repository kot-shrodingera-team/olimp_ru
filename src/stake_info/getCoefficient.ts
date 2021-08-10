import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getStakeInfoValue';
import { StakeInfoValueOptions } from '@kot-shrodingera-team/germes-generators/stake_info/types';
import { log } from '@kot-shrodingera-team/germes-utils';
import getBet from '../helpers/getBet';
import isClone from '../helpers/isClone';

export const coefficientSelector = isClone() ? '' : '.cur-val';

const coefficientOptions: StakeInfoValueOptions = {
  name: 'coefficient',
  ...(isClone()
    ? {
        fixedValue: () => {
          const bet = getBet();
          if (!bet) {
            log('Не найден коэффициент (ставка не найдена)', 'crimson');
            return 0;
          }
          const coefficient = bet.value;
          if (!coefficient) {
            log('Не найден коэффициент', 'crimson');
            return 0;
          }
          if (Number.isNaN(coefficient)) {
            log(`Непонятный формат коэффициента: "${coefficient}"`, 'crimson');
            return 0;
          }
          return coefficient;
        },
      }
    : {
        valueFromText: {
          text: {
            // getText: () => '',
            selector: coefficientSelector,
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

const getCoefficient = getStakeInfoValueGenerator(coefficientOptions);

export const coefficientReady =
  stakeInfoValueReadyGenerator(coefficientOptions);

export default getCoefficient;
