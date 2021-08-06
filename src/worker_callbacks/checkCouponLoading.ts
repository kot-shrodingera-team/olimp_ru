import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import {
  awaiter,
  getElement,
  log,
  stakeInfoString,
} from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';
// import JsFailError from '../show_stake/errors/jsFailError';
// import openBet from '../show_stake/openBet';
import { getDoStakeTime } from '../stake_info/doStakeTime';

const asyncCheck = async () => {
  const error = (message?: string) => {
    if (message !== undefined) {
      log(message, 'crimson');
    }
    window.germesData.betProcessingStep = 'error';
  };
  const success = (message: string) => {
    log(message, 'steelblue');
    window.germesData.betProcessingStep = 'success';
  };
  // const reopen = async (message: string) => {
  //   log(message, 'crimson');
  //   window.germesData.betProcessingStep = 'reopen';
  //   log('Переоткрываем купон', 'orange');
  //   try {
  //     await openBet();
  //     log('Ставка успешно переоткрыта', 'green');
  //     window.germesData.betProcessingStep = 'reopened';
  //   } catch (reopenError) {
  //     if (reopenError instanceof JsFailError) {
  //       log(reopenError.message, 'red');
  //       window.germesData.betProcessingStep = 'error';
  //     }
  //   }
  // };

  if (isClone()) {
    const betslipLoaderSelector = '.loading-bet:not([style="display: none;"])';
    const popUpSelector =
      '.js-popup:not([style="display: none;"]) .popup-error';
    const disabledBetSelctor = '.singles .item.betslip-disabled';
    const oddsChangedSelector = '.odds_changed:not([style="display: none;"])';
    const doneSelector = '.done:not([style="display: none;"])';

    window.germesData.betProcessingStep = 'waitingForLoaderOrResult';

    await Promise.any([
      getElement(betslipLoaderSelector, 50000),
      getElement(popUpSelector, 50000),
      getElement(disabledBetSelctor, 50000),
      getElement(oddsChangedSelector, 50000),
      getElement(doneSelector, 50000),
    ]);

    const betslipLoaderElement = document.querySelector(betslipLoaderSelector);

    if (betslipLoaderElement) {
      log('Появился индикатор', 'steelblue');
      window.germesData.betProcessingAdditionalInfo = 'индикатор';
      awaiter(
        () => {
          return document.querySelector(betslipLoaderSelector) === null;
        },
        50000,
        100
      ).then((loaderDissappeared) => {
        if (loaderDissappeared) {
          log('Исчез индикатор', 'steelblue');
          window.germesData.betProcessingAdditionalInfo = null;
        }
      });

      window.germesData.betProcessingStep = 'waitingForResult';
      await Promise.any([
        getElement(popUpSelector, 50000),
        getElement(disabledBetSelctor, 50000),
        getElement(oddsChangedSelector, 50000),
        getElement(doneSelector, 50000),
      ]);
    }

    const popUpElement = document.querySelector(popUpSelector);
    const disabledBetElement = document.querySelector(disabledBetSelctor);
    const oddsChangedElement = document.querySelector(oddsChangedSelector);
    const doneElement = document.querySelector(doneSelector);

    if (popUpElement) {
      log('Появилось всплывающее окно', 'steelblue');
      const popupTextElement = popUpElement.querySelector('.js-txt');
      if (!popupTextElement) {
        error('Не найден текст всплывающего окна');
      }
      const popupText = popupTextElement.textContent.trim();
      log(popupText, 'tomato');
      return error();
    }
    if (disabledBetElement) {
      return error('Ставка недоступна');
    }
    if (oddsChangedElement) {
      return error('Изменение коэффициента или исхода');
    }
    if (doneElement) {
      return success('Ставка принята');
    }

    return error('Не дождались результата ставки');
  }
  const loaderSelector = '[class*="common-loader__PreloaderWrap-sc"]';
  const resultMessageSelector = '[class*="results__ResultsMessage-sc"]';
  const betCardSelector = '[class*="bet-card-wrap__BetCardWrap"]';

  const checkResult = async (resultMessageElement: Element) => {
    const resultMessage = resultMessageElement.textContent.trim();
    if (/Ваша ставка успешно принята!/i.test(resultMessage)) {
      return success('Ставка принята');
    }
    log('Ошибка ставки', 'crimson');
    log(resultMessage, 'tomato');
    if (
      /Соединение оборвалось. Попробуйте ещ[её] раз|Network Error/i.test(
        resultMessage
      )
    ) {
      const message =
        `В Olimp ошибка ставки "${resultMessage}"\n` +
        `Ставка засчитана как НЕ принятая. Желательно проверить вручную\n` +
        `${stakeInfoString()}\n`;
      worker.Helper.SendInformedMessage(message);
      window.location.reload();
      return error();
    }
    log('Ждём появления карточки ставки', 'steelblue');
    window.germesData.betProcessingStep = 'waitingForBetCard';
    const betCard = await getElement(betCardSelector, 20000);
    if (!betCard) {
      log('Карточка ставки не появилась', 'steelblue');
    } else {
      log('Появилась карточка ставки', 'steelblue');
    }
    return error();
  };

  window.germesData.betProcessingStep = 'waitingForLoaderOrResult';

  await Promise.any([
    getElement(loaderSelector, 5000),
    getElement(resultMessageSelector, 5000),
  ]);
  const loaderElement = document.querySelector(loaderSelector);
  const resultMessageElement = document.querySelector(resultMessageSelector);
  if (!loaderElement && !resultMessageElement) {
    const betCard = document.querySelector(betCardSelector);
    if (betCard) {
      log('Есть карточка ставки', 'steelblue');
    } else {
      log('Нет карточки ставки', 'steelblue');
    }
    return error('Не появился ни индикатор, ни результат');
  }
  if (loaderElement) {
    log('Появился индикатор', 'steelblue');
    window.germesData.betProcessingAdditionalInfo = 'индикатор';
    awaiter(
      () => {
        return document.querySelector(loaderSelector) === null;
      },
      50000,
      100
    ).then((loaderDissappeared) => {
      if (loaderDissappeared) {
        log('Исчез индикатор', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = null;
      }
    });
    window.germesData.betProcessingStep = 'waitingForResultOrBetCard';
    await Promise.any([
      getElement(resultMessageSelector, 50000),
      getElement(betCardSelector, 50000),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const resultMessageElement = document.querySelector(resultMessageSelector);
    if (resultMessageElement) {
      return checkResult(resultMessageElement);
    }
    const betCard = document.querySelector(betCardSelector);
    if (betCard) {
      return error('Повилась карточка ставки');
    }
  }
  return checkResult(resultMessageElement);
};

const check = () => {
  const step = window.germesData.betProcessingStep;
  const additionalInfo = window.germesData.betProcessingAdditionalInfo
    ? ` (${window.germesData.betProcessingAdditionalInfo})`
    : '';
  switch (step) {
    case 'beforeStart':
      asyncCheck();
      return true;
    case 'error':
    case 'success':
    case 'reopened':
      log(`Обработка ставки завершена (${step})${additionalInfo}`, 'orange');
      return false;
    default:
      log(`Обработка ставки (${step})${additionalInfo}`, 'tan');
      return true;
  }
};

const checkCouponLoading = checkCouponLoadingGenerator({
  getDoStakeTime,
  bookmakerName: isClone() ? 'BetOlimp' : 'Олимп',
  timeout: 50000,
  check,
});

export default checkCouponLoading;
