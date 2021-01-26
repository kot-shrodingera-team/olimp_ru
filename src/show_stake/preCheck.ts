import { log, getElement } from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';
import JsFailError from './errors/jsFailError';

const preCheck = async (): Promise<void> => {
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
  if (window.location.pathname !== '/live') {
    log('Открыт не Live', 'steelblue');
    const live = document.querySelector('[href="/live"]') as HTMLElement;
    if (!live) {
      throw new JsFailError('Не найдена кнопка перехода на Live');
    }
    log('Переходим на Live', 'orange');
    live.click();
  } else {
    log('Октрыт Live', 'steelblue');
  }
};

export default preCheck;
