import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
import {
  getElement,
  getPhoneCountry,
  log,
} from '@kot-shrodingera-team/germes-utils';
import { setReactInputValue } from '@kot-shrodingera-team/germes-utils/reactUtils';
import isClone from '../isClone';
import { updateBalance, balanceReady } from '../stake_info/getBalance';
// import afterSuccesfulLogin from './afterSuccesfulLogin';

const setLoginType = async (): Promise<boolean> => {
  if (isClone()) {
    return true;
  }
  const phoneInput = document.querySelector(
    'input[name="phone"], input[name="login"]'
  );
  if (!phoneInput) {
    log('Не найдено поле ввода телефона', 'crimson');
    return false;
  }
  setReactInputValue(phoneInput, '+79999999999');
  const submitButton = document.querySelector<HTMLElement>('button.submit');
  if (!submitButton) {
    log('Не найдена кнопка входа', 'crimson');
    return false;
  }
  submitButton.click();
  worker.SetSessionData('OlimpRu.WaitingForSendSMSButton', '1');
  // enabled
  // common-button__CommonButton-xn93w0-0 outline__Outline-sc-90fv1c-0 authorization__SendSms-sc-1c1m7vp-5 fAOPex
  // disabled
  // common-button__CommonButton-xn93w0-0 outline__Outline-sc-90fv1c-0 authorization__SendSms-sc-1c1m7vp-5 jydxZu
  const sendSMSEnabledButton = (await getElement(
    '[class*="authorization__SendSms-"]',
    45000
  )) as HTMLElement;
  worker.SetSessionData('OlimpRu.WaitingForSendSMSButton', '0');
  if (!sendSMSEnabledButton) {
    log('Не дождались появления кнопки отправки смс', 'crimson');
    return false;
  }
  sendSMSEnabledButton.click();
  // common-button__CommonButton-xn93w0-0 outline__Outline-sc-90fv1c-0 authorization__SendSms-sc-1c1m7vp-5 authorization__OldSignInButton-sc-1c1m7vp-6 cvcnbA
  const signInViaPasswordButton = document.querySelector<HTMLElement>(
    '[class*="authorization__OldSignInButton-"]'
  );
  if (!signInViaPasswordButton) {
    log('Не найдена кнопка входа по паролю', 'crimson');
    return false;
  }
  signInViaPasswordButton.click();
  const phoneLogin = Boolean(getPhoneCountry());
  if (phoneLogin) {
    const phoneTab = (await getElement(
      'form [class*="common-tab__CommonTab-"]:nth-child(1)',
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
    'form [class*="common-tab__CommonTab-"]:nth-child(2)',
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
      selector: 'button[class*="not-autorized-bar__ButtonAsLink-"]',
      openedSelector: '[class*="form-wrap__FormWrap-"]',
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
