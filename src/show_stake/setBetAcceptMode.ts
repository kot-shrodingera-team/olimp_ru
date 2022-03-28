import { getElement, log } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import isClone from '../helpers/isClone';

const setBetAcceptMode = async (): Promise<void> => {
  if (isClone()) {
    log('В BetOlimp не реализована смена режима принятия ставки', 'crimson');
    return;
  }

  const settingsTab = document.querySelector<HTMLElement>(
    '.betslip__CouponTab-tyjzhu-2.jBiqQG, .sticky-column:last-child > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(3)'
  );
  if (!settingsTab) {
    throw new JsFailError('Не найдена вкладка настроек');
  }
  settingsTab.click();

  await getElement('[name="changeAccept"]');

  const acceptInputs = document.querySelectorAll<HTMLInputElement>(
    '[name="changeAccept"]'
  );
  if (acceptInputs.length === 0) {
    throw new JsFailError('Не найдены опции принятия ставок');
  }
  if (acceptInputs.length !== 3) {
    throw new JsFailError('Найдено не 3 опции принятия ставок');
  }

  if (worker.StakeAcceptRuleShoulder === 0) {
    if (acceptInputs[0].checked) {
      log(
        'Уже выбран режим принятия ставок только с текущим коэффициентом',
        'steelblue'
      );
    } else {
      log(
        'Выбираем режим принятия ставок только с текущим коэффициентом',
        'orange'
      );
      acceptInputs[0].click();
    }
  } else if (worker.StakeAcceptRuleShoulder === 1) {
    if (acceptInputs[1].checked) {
      log(
        'Уже выбран режим принятия ставок только с повышением коэффициента',
        'steelblue'
      );
    } else {
      log(
        'Выбираем режим принятия ставок только с повышением коэффициента',
        'orange'
      );
      acceptInputs[1].click();
    }
  } else if (worker.StakeAcceptRuleShoulder === 2) {
    if (acceptInputs[2].checked) {
      log(
        'Уже выбран режим принятия ставок с любым изменением коэффициента',
        'steelblue'
      );
    } else {
      log(
        'Выбираем режим принятия ставок с любым изменением коэффициента',
        'orange'
      );
      acceptInputs[2].click();
    }
  }

  const couponTab = document.querySelector<HTMLElement>(
    '.betslip__CouponTab-tyjzhu-2.jBiqQG, .sticky-column:last-child > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1)'
  );
  if (!couponTab) {
    throw new JsFailError('Не найдена вкладка корзины');
  }
  couponTab.click();

  const anyBet = await getElement(
    '.sticky-column:last-child > :nth-child(1) > :nth-child(1) [href]'
  );
  if (!anyBet) {
    throw new JsFailError(
      'Не дождались появления ставки в купоне после перехода на вкладку корзины'
    );
  }
};

export default setBetAcceptMode;
