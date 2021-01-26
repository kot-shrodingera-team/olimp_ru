import doStakeGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/doStake';
import { log } from '@kot-shrodingera-team/germes-utils';
import getCoefficient from '../stake_info/getCoefficient';
import { clearDoStakeTime } from '../stake_info/doStakeTime';
import isClone from '../isClone';
import { clearNoResultScreenshot } from './checkCouponLoading';

// const preCheck = (): boolean => {
//   return true;
// };

const postCheck = (): boolean => {
  if (isClone()) {
    const oddsChanged = document.querySelector(
      '.odds_changed:not([style="display: none;"])'
    );
    if (oddsChanged) {
      const closeButton = oddsChanged.querySelector(
        '.js-alert-close'
      ) as HTMLElement;
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
  clearNoResultScreenshot();
  return true;
};

const doStake = (() => {
  if (isClone()) {
    return doStakeGenerator({
      // preCheck,
      doStakeButtonSelector: 'button.placeBetButton',
      getCoefficient,
      // disabledCheck: false,
      // errorClasses: [
      //   {
      //     className: '',
      //     message: '',
      //   },
      // ],
      postCheck,
      clearDoStakeTime,
    });
  }
  return doStakeGenerator({
    // preCheck,
    doStakeButtonSelector: '#betslip button[type="submit"]',
    getCoefficient,
    disabledCheck: true,
    // errorClasses: [
    //   {
    //     className: '',
    //     message: '',
    //   },
    // ],
    postCheck,
    clearDoStakeTime,
  });
})();

export default doStake;
