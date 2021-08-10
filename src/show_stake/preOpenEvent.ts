import {
  checkBookerHost,
  checkCurrency,
  getElement,
  log,
} from '@kot-shrodingera-team/germes-utils';
import {
  NewUrlError,
  JsFailError,
} from '@kot-shrodingera-team/germes-utils/errors';
import getSiteCurrency from '../helpers/getSiteCurrency';
import isClone from '../helpers/isClone';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import { balanceReady, updateBalance } from '../stake_info/getBalance';

const preOpenEvent = async (): Promise<void> => {
  if (!checkBookerHost()) {
    log('Открыта не страница конторы (или зеркала)', 'crimson');
    log(`${window.location.href} !== ${worker.BookmakerMainUrl}`, 'crimson');
    window.location.href = new URL(worker.BookmakerMainUrl).href;
    throw new NewUrlError('Открываем страницу БК');
  }

  await authStateReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    throw new JsFailError('Нет авторизации');
  }
  log('Есть авторизация', 'steelblue');
  await balanceReady();
  updateBalance();

  const siteCurrency = getSiteCurrency();
  checkCurrency(siteCurrency);
  // Клон
  if (isClone()) {
    return;
  }
  // ЦУПИС
  const couponTabInactive = document.querySelector<HTMLElement>(
    '.betslip__CouponTab-tyjzhu-2.jBiqQG'
  );
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

export default preOpenEvent;
