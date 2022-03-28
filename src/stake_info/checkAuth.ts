import checkAuthGenerator, {
  authStateReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';
import isClone from '../helpers/isClone';

export const noAuthElementSelector = isClone()
  ? 'input#login-username'
  : // : 'button[class*="not-autorized-bar__ButtonAsLink-"], #header > :nth-child(1) > :nth-child(2) > :nth-child(3) > button:nth-child(1)';
    'button[class*="not-autorized-bar__ButtonAsLink-"], #header > :nth-child(1) > :nth-child(2) > :nth-child(4) > button:nth-child(1)';
export const authElementSelector = isClone()
  ? '.js-showusername'
  : 'span[title="Личный кабинет"], [href="/user/history"]';

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
