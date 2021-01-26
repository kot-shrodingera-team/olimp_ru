import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
import {
  getElement,
  getPhoneCountry,
  log,
} from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';
import { updateBalance, balanceReady } from '../stake_info/getBalance';
// import afterSuccesfulLogin from './afterSuccesfulLogin';

const setLoginType = async (): Promise<boolean> => {
  if (isClone()) {
    return true;
  }
  const phoneLogin = Boolean(getPhoneCountry());
  if (phoneLogin) {
    const phoneTab = (await getElement(
      'form .common-tab__CommonTab-sc-1w94sug-0:nth-child(1)',
      2000
    )) as HTMLElement;
    if (!phoneTab) {
      log('Не найдена кнопка переключения на вход по телефону', 'crimson');
      return false;
    }
    if (![...phoneTab.classList].includes('active')) {
      phoneTab.click();
      if (![...phoneTab.classList].includes('active')) {
        log('Не удалось переключиться на вход по телефону', 'crimson');
        return false;
      }
    }
    return true;
  }
  const loginTab = (await getElement(
    'form .common-tab__CommonTab-sc-1w94sug-0:nth-child(2)',
    2000
  )) as HTMLElement;
  if (!loginTab) {
    log('Ошибка: Не найдена кнопка переключения на вход по логину', 'crimson');
    return false;
  }
  if (![...loginTab.classList].includes('active')) {
    loginTab.click();
    if (![...loginTab.classList].includes('active')) {
      log('Ошибка: Не удалось переключиться на вход по логину', 'crimson');
      return false;
    }
  }
  return true;
};

const authorize = (() => {
  if (isClone()) {
    return authorizeGenerator({
      // openForm: {
      // selector: '',
      // openedSelector: '',
      // afterOpenDelay: 0,
      // },
      // setLoginType,
      loginInputSelector: 'input#login-username',
      passwordInputSelector: 'input#login-password',
      submitButtonSelector: 'button#login_btn',
      inputType: 'fireEvent',
      beforeSubmitDelay: 1000, // Без задержки не проходит логин
      // captchaSelector: '',
      // loginedWait: {
      //   loginedSelector: '',
      //   balanceReady,
      //   updateBalance,
      // },
      // afterSuccesfulLogin,
    });
  }
  return authorizeGenerator({
    openForm: {
      selector: 'button.not-autorized-bar__ButtonAsLink-u8i7bt-0',
      openedSelector: '.form-wrap__FormWrap-sc-1j4hepk-0',
      // afterOpenDelay: 0,
    },
    setLoginType,
    loginInputSelector: 'input[name="phone"], input[name="login"]',
    passwordInputSelector: 'input[name="password"]',
    submitButtonSelector: 'button.submit',
    inputType: 'react',
    // beforeSubmitDelay: 0,
    // captchaSelector: '',
    loginedWait: {
      loginedSelector: 'span[title="Личный кабинет"]',
      balanceReady,
      updateBalance,
    },
    // afterSuccesfulLogin,
  });
})();

export default authorize;
