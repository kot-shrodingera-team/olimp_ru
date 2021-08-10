import doStakeGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/doStake';
import { log } from '@kot-shrodingera-team/germes-utils';
import getCoefficient from '../stake_info/getCoefficient';
import isClone from '../helpers/isClone';

// const preCheck = (): boolean => {
//   return true;
// };

const postCheck = (): boolean => {
  if (isClone()) {
    const oddsChanged = document.querySelector(
      '.odds_changed:not([style="display: none;"])'
    );
    if (oddsChanged) {
      const closeButton =
        oddsChanged.querySelector<HTMLElement>('.js-alert-close');
      if (!closeButton) {
        log(
          'Не найдена кнопка закрытия сообщения об изменении коэффициента или исхода',
          'crimson'
        );
      } else {
        log(
          'Закрываем сообщение об изменении коэффициента или исхода',
          'orange'
        );
        closeButton.click();
      }
    }
  }
  return true;
};

const doStake = doStakeGenerator({
  // preCheck,
  doStakeButtonSelector: isClone()
    ? 'button.placeBetButton'
    : '#betslip button[type="submit"]',
  // errorClasses: [
  //   {
  //     className: '',
  //     message: '',
  //   },
  // ],
  // eslint-disable-next-line no-unneeded-ternary
  disabledCheck: isClone() ? false : true,
  getCoefficient,
  postCheck,
  // context: () => document,
});

export default doStake;
