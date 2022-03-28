import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
import {
  getElement,
  getPhoneLoginData,
  log,
  sleep,
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
  const phoneInput = await getElement(
    'input[name="phone"], input[name="login"]'
  );
  if (!phoneInput) {
    log('Не найдено поле ввода телефона', 'crimson');
    return false;
  }
  await sleep(100);
  const phoneData = getPhoneLoginData();
  if (phoneData) {
    setReactInputValue(phoneInput, `+7${phoneData.nsn}`);
  } else {
    log(
      'Не удалось определить номер телефона из логина. Обратитесь в ТП',
      'crimson'
    );
    return false;
  }
  const submitButton = await getElement<HTMLElement>(
    'button.submit, button[type="submit"]'
  );
  if (!submitButton) {
    log('Не найдена кнопка входа', 'crimson');
    return false;
  }
  submitButton.click();
  await Promise.race([
    getElement('input[name="password"]'),
    getElement('input[name="code"]'),
  ]);
  if (document.querySelector('input[name="code"]')) {
    log(
      'Появилось поле ввода СМС-кода. Скорее всего не существует аккаунта с таким телефоном',
      'crimson'
    );
    return false;
  }

  if (document.querySelector('input[name="password"]')) {
    log('Появилось поле ввода пароля', 'cadetblue', true);
    return true;
  }

  log('Не дождались появления поля ввода пароля', 'crimson');
  return false;
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
        selector:
          // 'button[class*="not-autorized-bar__ButtonAsLink-"], #header > :nth-child(1) > :nth-child(2) > :nth-child(3) > button:nth-child(1)',
          'button[class*="not-autorized-bar__ButtonAsLink-"], #header > :nth-child(1) > :nth-child(2) > :nth-child(4) > button:nth-child(1)',
        openedSelector:
          '[class*="form-wrap__FormWrap-"], #modal-root > :nth-child(1) > :nth-child(1)',
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
