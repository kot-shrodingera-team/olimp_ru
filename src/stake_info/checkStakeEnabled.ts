import checkStakeEnabledGenerator from '@kot-shrodingera-team/germes-generators/stake_info/checkStakeEnabled';
import { log } from '@kot-shrodingera-team/germes-utils';
import getBet from '../helpers/getBet';
import isClone from '../helpers/isClone';
import getStakeCount from './getStakeCount';

const preCheck = (): boolean => {
  if (isClone()) {
    const bet = getBet();
    if (!bet) {
      log('Ставка недоступна (не найдена)', 'crimson');
      return false;
    }
    if (bet.deleted) {
      log('Ставка недоступна (заблокирована)', 'crimson');
      return false;
    }
    return true;
  }
  return true;
};

const checkStakeEnabled = checkStakeEnabledGenerator({
  preCheck,
  getStakeCount,
  // betCheck: {
  //   selector: '',
  //   errorClasses: [
  //     {
  //       className: '',
  //       message: '',
  //     },
  //   ],
  // },
  errorsCheck: [
    {
      selector: isClone()
        ? '.singles .item.betslip-disabled'
        : '[class*="bet-card__LockedMatch"]',
      message: 'заблокирована',
    },
  ],
  // context: () => document,
});

export default checkStakeEnabled;
