import { OlimpCloneBet } from '../bookmakerApi';

const getBet = (): OlimpCloneBet => {
  if (!window.betslip) {
    return null;
  }
  const keys = Object.keys(window.betslip);
  if (keys.length === 0) {
    return null;
  }
  return window.betslip[keys[0]];
};

export default getBet;
