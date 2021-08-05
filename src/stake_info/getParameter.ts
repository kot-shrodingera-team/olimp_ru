import { log } from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';

const getParameter = (): number => {
  if (isClone()) {
    const betNameElement = document.querySelector('.name .fll');
    if (!betNameElement) {
      log('Не найден параметр (не найдена роспись)');
      return -9999;
    }
    const betName = betNameElement.textContent.trim();
    const parameterRegex = /\(([+-]?\d+(?:\.\d+)?)\)/;
    const parameterMatch = betName.match(parameterRegex);
    if (!parameterMatch) {
      log('Ставка без параметра', 'steelblue');
      return -6666;
    }
    const parameter = Number(parameterMatch[1]);
    log(`Параметр: ${parameter}`, 'steelblue');
    return parameter;
  }
  const betOutcomeName = document.querySelector(
    '[class*="bet-card__OutcomeName-"]'
  );
  if (!betOutcomeName) {
    log('Не найден параметр (не найдена роспись ставки)', 'crimson');
    return -9999;
  }
  const parameterRegex = /^.*\(([+-]?\d+(?:\.\d+)?)\)(?: бол| мен)?$/;
  const match = betOutcomeName.textContent.match(parameterRegex);
  if (!match) {
    log('Ставка без параметра', 'steelblue');
    return -6666;
  }
  const parameter = Number(match[1]);
  log(`Параметр: ${parameter}`, 'steelblue');
  return parameter;
};

export default getParameter;
