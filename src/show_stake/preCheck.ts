import { log, getElement } from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';
import JsFailError from './errors/jsFailError';

const preCheck = async (): Promise<void> => {
  if (!('any' in Promise)) {
    throw new JsFailError(
      'Ошибка браузера, нет нужных функций. Обновите общий UA (при запуске бота). Если не поможет, обратитесь в ТП'
    );
  }
  // Клон
  if (isClone()) {
    return;
  }
  // ЦУПИС
  const couponTabInactive = document.querySelector(
    '.betslip__CouponTab-tyjzhu-2.jBiqQG'
  ) as HTMLElement;
  if (couponTabInactive) {
    log('Открыта не вкладка с купонами. Переключаем вкладку', 'orange');
    couponTabInactive.click();
    const couponTabActive = await getElement(
      '.betslip__CouponTab-tyjzhu-2.cLoJdY'
    );
    if (!couponTabActive) {
      throw new JsFailError('Вкладка так и не переключилась');
    }
  }
};

export default preCheck;
