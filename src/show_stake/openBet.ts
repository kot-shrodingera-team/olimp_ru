import { awaiter, getElement, log } from '@kot-shrodingera-team/germes-utils';
import { getReactInstance } from '@kot-shrodingera-team/germes-utils/reactUtils';
import { OutcomeGroupList } from '../bookmakerApi';
import isClone from '../isClone';
import getMaximumStake, {
  maximumStakeReady,
} from '../stake_info/getMaximumStake';
import getStakeCount from '../stake_info/getStakeCount';
import JsFailError from './errors/jsFailError';

const openBet = async (): Promise<boolean> => {
  // Клон
  if (isClone()) {
    const betId = worker.BetId.split('_')[0];
    const [cloneId, cloneSid] = [
      betId.substring(0, betId.length - 1),
      betId.substring(betId.length - 1),
    ];
    const betData = worker.BetId.split('_')[1].split(':');
    const parameter = betData[3];
    log(`betAdd(${cloneId}, ${cloneSid}, 'lv', '1', ${parameter})`, 'orange');
    const maxTryCount = 5;
    for (let i = 1; i <= maxTryCount; i += 1) {
      betAdd(cloneId, cloneSid, 'lv', '1', parameter);
      // eslint-disable-next-line no-await-in-loop
      const betAdded = await awaiter(() => getStakeCount() === 1, 1000, 50);

      if (!betAdded) {
        if (i === maxTryCount) {
          throw new JsFailError('Ставка так и не попала в купон');
        }
        log(`Ставка не попала в купон (попытка ${i})`, 'steelblue');
      } else {
        log('Ставка попала в купон', 'steelblue');
        break;
      }
    }
    // log('Ставка найдена', 'steelblue');
    return;
  }
  // ЦУПИС
  log(`Ищем ставку "${worker.BetName}"`, 'steelblue');
  await getElement('[class*="FullMatchStyled"] [class*="GroupOutcomes"]');

  const outcome = await awaiter(
    () => {
      const outcomeGroups = [
        ...document.querySelectorAll(
          '[class*="FullMatchStyled"] [class*="GroupOutcomes"]'
        ),
      ];
      outcomeGroups.forEach((group) => {
        if (!group.querySelector('ul')) {
          group.querySelector('div').click();
        }
      });
      const outcomeGroupLists = [
        ...document.querySelectorAll(
          '[class*="FullMatchStyled"] [class*="GroupOutcomes"] ul[class*="List"]'
        ),
      ];
      let result = null;
      const reactKey = Number(
        worker.BetId.substring(0, worker.BetId.indexOf('_'))
      );
      // eslint-disable-next-line no-restricted-syntax
      for (const outcomeGroupList of outcomeGroupLists) {
        // console.log(outcomeGroupList.previousElementSibling.textContent);
        result = (getReactInstance(
          outcomeGroupList
        ) as OutcomeGroupList).memoizedProps.children.find((currentOutcome) => {
          // console.log(
          //   `${currentOutcome.props.children.props.name} - ${currentOutcome.props.children.props.id}`
          // );
          return currentOutcome.props.children.props.id === reactKey;
        });
        if (result) {
          return result;
        }
      }
      return null;
    },
    5000,
    100
  );

  if (!outcome) {
    throw new JsFailError('Ставка не найдена');
  }
  log('Ставка найдена', 'steelblue');

  const maxTryCount = 5;
  for (let i = 1; i <= maxTryCount; i += 1) {
    outcome.props.children.props.onClick();
    // eslint-disable-next-line no-await-in-loop
    const betAdded = await awaiter(() => getStakeCount() === 1, 200, 50);

    if (!betAdded) {
      if (i === maxTryCount) {
        throw new JsFailError('Ставка так и не попала в купон');
      }
      log(`Ставка не попала в купон (попытка ${i})`, 'steelblue');
    } else {
      log('Ставка попала в купон', 'steelblue');
      break;
    }
  }
  await maximumStakeReady();
  if (
    !(await awaiter(
      () => getMaximumStake() !== 9007199254740991 && getMaximumStake() !== 0,
      2000
    ))
  ) {
    throw new JsFailError(' Максимальная ставка не появилась');
  }
};

export default openBet;
