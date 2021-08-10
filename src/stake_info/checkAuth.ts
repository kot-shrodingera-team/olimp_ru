import checkAuthGenerator, {
  authStateReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';
import isClone from '../helpers/isClone';

export const noAuthElementSelector = isClone()
  ? 'input#login-username'
  : 'button[class*="not-autorized-bar__ButtonAsLink-"]';
export const authElementSelector = isClone()
  ? '.js-showusername'
  : 'span[title="Личный кабинет"]';

export const authStateReady = authStateReadyGenerator({
  noAuthElementSelector,
  authElementSelector,
  maxDelayAfterNoAuthElementAppeared: isClone() ? 0 : 2000,
  // context: () => document,
});

const checkAuth = checkAuthGenerator({
  authElementSelector,
  // context: () => document,
});

export default checkAuth;
