import {
  awaiter,
  log,
  repeatingOpenBet,
  text,
} from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import findBet from '../helpers/findBet';
import isClone from '../helpers/isClone';
import getMaximumStake, {
  maximumStakeReady,
} from '../stake_info/getMaximumStake';
import getStakeCount from '../stake_info/getStakeCount';
import clearCoupon from './clearCoupon';

const openBet = async (): Promise<void> => {
  /* ======================================================================== */
  /*                              Очистка купона                              */
  /* ======================================================================== */

  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    throw new JsFailError('Не удалось очистить купон');
  }

  /* ======================================================================== */
  /*                      Формирование данных для поиска                      */
  /* ======================================================================== */

  const cloneBetId = isClone() ? worker.BetId.split('_')[0] : undefined;
  const cloneId = isClone()
    ? cloneBetId.substring(0, cloneBetId.length - 1)
    : undefined;
  const cloneSid = isClone()
    ? cloneBetId.substring(cloneBetId.length - 1)
    : undefined;
  const cloneBetData = isClone()
    ? worker.BetId.split('_')[1].split(':')
    : undefined;
  const cloneParameter = isClone() ? cloneBetData[3] : undefined;
  const reactKey = Number(worker.BetId.substring(0, worker.BetId.indexOf('_')));

  /* ======================================================================== */
  /*                               Поиск ставки                               */
  /* ======================================================================== */

  const bet = isClone() ? undefined : await findBet(reactKey);
  if (!isClone() && !bet) {
    throw new JsFailError('Ставка не найдена');
  }

  /* ======================================================================== */
  /*           Открытие ставки, проверка, что ставка попала в купон           */
  /* ======================================================================== */

  const openingAction = async () => {
    if (isClone()) {
      window.betAdd(cloneId, cloneSid, 'lv', '1', cloneParameter);
    } else {
      bet.props.children.props.onClick();
    }
  };
  await repeatingOpenBet(openingAction, getStakeCount, 5, 1000, 50);

  /* ======================================================================== */
  /*                  Ожидание появления максимальной ставки                  */
  /* ======================================================================== */

  if (isClone()) {
    // noop
  } else {
    const maxLoaded = await maximumStakeReady();
    if (!maxLoaded) {
      throw new JsFailError('Максимальная ставка не появилась');
    }
    await awaiter(() => {
      if (getStakeCount() !== 1) {
        return true;
      }
      if (getMaximumStake() !== 9007199254740991) {
        return true;
      }
      return false;
    });
    const stakeCount = getStakeCount();
    if (stakeCount !== 1) {
      const resultMessageElement = document.querySelector(
        '[class*="results__ResultsMessage-"]'
      );
      if (resultMessageElement) {
        const resultMessage = text(resultMessageElement).replace(
          /^([a-zA-Z]*Icon)/,
          '$&\n'
        );
        if (/Выбранный Вами исход недоступен/i.test(resultMessage)) {
          throw new JsFailError('Исход недоступен');
        }
      }
      throw new JsFailError(`В ставке не 1 купон (${stakeCount})`);
    }
    if (getMaximumStake() === 9007199254740991) {
      throw new JsFailError('Максимальная ставка не поменялась');
    }
  }

  /* ======================================================================== */
  /*                    Вывод информации об открытой ставке                   */
  /* ======================================================================== */

  const eventNameSelector = '[class*="bet-card__MatchName-"]';
  // const marketNameSelector = '';
  const betNameSelector = '[class*="bet-card__OutcomeName-"]';

  const eventNameElement = document.querySelector(eventNameSelector);
  // const marketNameElement = document.querySelector(marketNameSelector);
  const betNameElement = document.querySelector(betNameSelector);

  if (!eventNameElement) {
    throw new JsFailError('Не найдено событие открытой ставки');
  }
  // if (!marketNameElement) {
  //   throw new JsFailError('Не найден маркет открытой ставки');
  // }
  if (!betNameElement) {
    throw new JsFailError('Не найдена роспись открытой ставки');
  }

  const eventName = text(eventNameElement);
  // const marketName = text(marketNameElement);
  const betName = text(betNameElement);

  // log(`Открыта ставка\n${eventName}\n${marketName}\n${betName}`, 'steelblue');
  log(`Открыта ставка\n${eventName}\n${betName}`, 'steelblue');
};

export default openBet;
