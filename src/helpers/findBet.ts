import { awaiter, log, text } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
// import { getReactInstance } from '@kot-shrodingera-team/germes-utils/reactUtils';
import {
  // OutcomeGroup,
  // OutcomeGroupList,
  OutcomeReactInstance,
} from '../bookmakerApi';

const getReactInstance = (element: Element): unknown => {
  if (element) {
    return (element as unknown as Record<string, unknown>)[
      Object.keys(element).find((key) => key.startsWith('__reactFiber'))
    ];
  }
  return null;
};

const findBet = async (reactKey: number): Promise<HTMLElement> => {
  const result = await awaiter(
    () => {
      const expandButtons = [
        ...document.querySelectorAll<HTMLElement>(
          '[class*="FullMatchStyled"] [class*="GroupOutcomes"], .sticky-column:first-child ~ :not(.sticky-column) > :nth-child(2) > :nth-child(2) > * > div > button'
        ),
      ];

      expandButtons.forEach((button) => {
        const textElement = button.querySelector('span');
        if (!textElement) {
          log('Не найден текст кнопки разворачивания маркета', 'crimson');
        } else if (text(textElement) === 'Развернуть') {
          button.click();
        }
      });

      const bets = [
        ...document.querySelectorAll<HTMLElement>(
          '.sticky-column:first-child ~ :not(.sticky-column) span[role="button"]'
        ),
      ];

      const suitableBets = bets.filter((bet) => {
        const reactInstance = <OutcomeReactInstance>getReactInstance(bet);
        return reactInstance.return.memoizedProps.id === String(reactKey);
      });

      if (suitableBets.length === 0) {
        return null;
      }
      if (suitableBets.length !== 1) {
        return new JsFailError('Найдено больше 1 подходящей ставки');
      }

      return suitableBets[0];
    },
    5000,
    100
  );
  if (result instanceof JsFailError) {
    throw result;
  }
  return result;
};

export default findBet;
