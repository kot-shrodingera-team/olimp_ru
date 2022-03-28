import {
  checkBookerHost,
  checkCurrency,
  getElement,
  log,
  sleep,
  // sleep,
} from '@kot-shrodingera-team/germes-utils';
import {
  NewUrlError,
  JsFailError,
} from '@kot-shrodingera-team/germes-utils/errors';
import getSiteCurrency from '../helpers/getSiteCurrency';
import isClone from '../helpers/isClone';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import { balanceReady, updateBalance } from '../stake_info/getBalance';
import clearCoupon from './clearCoupon';

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
  if (!window.location.pathname.startsWith('/live')) {
    log('Открыт не лайв', 'steelblue');
    const liveButton = await getElement<HTMLElement>('[href="/live"]');
    if (!liveButton) {
      throw new JsFailError('Не найдена кнопка перехода на лайв');
    }
    log('Переходим на лайв', 'orange');
    liveButton.click();
    await sleep(1000);
  }

  const couponTab = await getElement<HTMLElement>(
    '.betslip__CouponTab-tyjzhu-2.jBiqQG, .sticky-column:last-child > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1)'
  );
  if (!couponTab) {
    throw new JsFailError('Не найдена вкладка купона "Корзина"');
  }
  if (!couponTab.classList.contains('active')) {
    log('Открыта не вкладка купона "Корзина"', 'steelblue');
    log('Переходим на вкладку купона "Корзина"', 'orange');
    couponTab.click();
  } else {
    log('Открыта вкладка купона "Корзина"', 'cadetblue', true);
  }

  /* ======================================================================== */
  /*              Очистка купона перед переходом на новое событие             */
  /* ======================================================================== */

  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    throw new JsFailError('Не удалось очистить купон');
  }
  // await sleep(100);
};

export default preOpenEvent;
