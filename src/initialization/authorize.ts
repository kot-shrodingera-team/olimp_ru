import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
import {
  getElement,
  getPhoneLoginData,
  log,
  // resolveRecaptcha,
} from '@kot-shrodingera-team/germes-utils';
import { setReactInputValue } from '@kot-shrodingera-team/germes-utils/reactUtils';
import { authElementSelector } from '../stake_info/checkAuth';
import isClone from '../helpers/isClone';
import { updateBalance, balanceReady } from '../stake_info/getBalance';
// import afterSuccesfulLogin from './afterSuccesfulLogin';

const preInputCheck = async (): Promise<boolean> => {
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
  const phoneData = getPhoneLoginData();
  if (phoneData) {
    setReactInputValue(phoneInput, `+7${phoneData.nsn}`);
  } else {
    setReactInputValue(phoneInput, `+79996857230`);
  }
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
    '[class*="authorization__SendSms-"]:not([disabled])',
    90000
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
  const phoneLogin = Boolean(getPhoneLoginData());
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
  const loginTab = await getElement<HTMLElement>(
    'form [class*="common-tab__CommonTab-"]:nth-child(2)',
    2000
  );
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

// const beforeSubmitCheck = async (): Promise<boolean> => {
//   // const recaptchaIFrame = await getElement('iframe[title="reCAPTCHA"]', 1000);
//   // if (recaptchaIFrame) {
//   //   log('Есть капча. Пытаемся решить', 'orange');
//   //   try {
//   //     await resolveRecaptcha();
//   //   } catch (e) {
//   //     if (e instanceof Error) {
//   //       log(e.message, 'red');
//   //     }
//   //     return false;
//   //   }
//   // } else {
//   //   log('Нет капчи', 'steelblue');
//   // }
//   return true;
// };

const authorize = authorizeGenerator({
  openForm: isClone()
    ? undefined
    : {
        selector: 'button[class*="not-autorized-bar__ButtonAsLink-"]',
        openedSelector: '[class*="form-wrap__FormWrap-"]',
        // loopCount: 10,
        // triesInterval: 1000,
        // afterOpenDelay: 0,
      },
  preInputCheck,
  loginInputSelector: isClone()
    ? 'input#login-username'
    : 'input[name="phone"], input[name="login"]',
  passwordInputSelector: isClone()
    ? 'input#login-password'
    : 'input[name="password"]',
  submitButtonSelector: isClone() ? 'button#login_btn' : 'button.submit',
  inputType: isClone() ? 'fireEvent' : 'react',
  fireEventNames: ['input'],
  beforeSubmitDelay: isClone() ? 1000 : 0,
  // beforeSubmitCheck,
  // captchaSelector: '',
  loginedWait: isClone()
    ? undefined
    : {
        loginedSelector: authElementSelector,
        timeout: 5000,
        balanceReady,
        updateBalance,
        // afterSuccesfulLogin,
      },
  // context: () => document,
});

export default authorize;
