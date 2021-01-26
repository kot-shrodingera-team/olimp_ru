import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import { log } from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';
import { getDoStakeTime } from '../stake_info/doStakeTime';

let noResultSreenshot = false;
export const clearNoResultScreenshot = (): void => {
  noResultSreenshot = false;
};

const check = () => {
  // Клон
  if (isClone()) {
    const betslipLoader = document.querySelector(
      '.loading-bet:not([style="display: none;"])'
    );
    if (betslipLoader) {
      log('Обработка ставки (индикатор)', 'tan');
      return true;
    }
    const popupError = document.querySelector(
      '.js-popup:not([style="display: none;"]) .popup-error'
    );
    if (popupError) {
      const popupErrorText = popupError.querySelector('.js-txt');
      if (!popupErrorText) {
        log('Обработка ставки (всплывающее окно, но нет текста)', 'tan');
        return true;
      }
      log('Обработка ставки завершена (всплывающее окно)', 'orange');
      return false;
    }
    const doneElement = document.querySelector(
      '.done:not([style="display: none;"])'
    );
    if (doneElement) {
      log('Обработка ставки завершена (успешная ставка)', 'orange');
      return false;
    }
    const disabledBet = document.querySelector(
      '.singles .item.betslip-disabled'
    );
    if (disabledBet) {
      log('Обработка ставки завершена (ставка недоступна)', 'orange');
      return false;
    }
    const oddsChanged = document.querySelector(
      '.odds_changed:not([style="display: none;"])'
    );
    if (oddsChanged) {
      log(
        'Обработка ставки завершена (изменение коэффициента или исхода)',
        'orange'
      );
      return false;
    }
    log('Обработка ставки (нет индикатора и результата)', 'tan');
    return false;
  }
  // ЦУПИС
  const betslipBodyLoader = document.querySelector(
    '.common-loader__PreloaderWrap-sc-24uv27-0'
  );
  if (betslipBodyLoader) {
    log('Обработка ставки (индикатор)', 'tan');
    return true;
  }
  const resultMessage = document.querySelector(
    '.results__ResultsMessage-sc-7a3lgm-0'
  );
  if (resultMessage) {
    log('Обработка ставки завершена (есть результат)', 'orange');
    return false;
  }
  const betCard = document.querySelector(
    '.bet-card-wrap__BetCardWrap-muhxrm-0'
  );
  if (betCard) {
    log('Обработка ставки завершена (появился betCard)', 'orange');
    return false;
  }
  if (noResultSreenshot === false) {
    worker.TakeScreenShot(false);
    noResultSreenshot = true;
  }
  log('Обработка ставки (нет лоадера и результата)', 'tan');
  return true;
};

const checkCouponLoading = (() => {
  if (isClone()) {
    return checkCouponLoadingGenerator({
      getDoStakeTime,
      bookmakerName: 'BetOlimp',
      timeout: 50000,
      check,
    });
  }
  return checkCouponLoadingGenerator({
    getDoStakeTime,
    bookmakerName: 'OlimpRu',
    timeout: 50000,
    check,
  });
})();

export default checkCouponLoading;
