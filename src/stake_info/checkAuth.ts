import checkAuthGenerator, {
  authStateReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';
import isClone from '../isClone';

export const authStateReady = (() => {
  if (isClone()) {
    return authStateReadyGenerator({
      noAuthElementSelector: 'input#login-username',
      authElementSelector: '.js-showusername',
      // maxDelayAfterNoAuthElementAppeared: 0,
      logging: false,
    });
  }
  return authStateReadyGenerator({
    noAuthElementSelector: 'button.not-autorized-bar__ButtonAsLink-u8i7bt-0',
    authElementSelector: 'span[title="Личный кабинет"]',
    maxDelayAfterNoAuthElementAppeared: 2000,
    // logging: false,
  });
})();

const checkAuth = (() => {
  if (isClone()) {
    return checkAuthGenerator({
      authElementSelector: '.js-showusername',
    });
  }
  return checkAuthGenerator({
    authElementSelector: 'span[title="Личный кабинет"]',
  });
})();

export default checkAuth;
