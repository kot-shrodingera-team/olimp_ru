import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import {
  log,
  getElement,
  awaiter,
  getRemainingTimeout,
  checkCouponLoadingError,
  checkCouponLoadingSuccess,
  text,
  sleep,
  timeString,
  stakeInfoString,
  // sendTGBotMessage,
} from '@kot-shrodingera-team/germes-utils';
import { StateMachine } from '@kot-shrodingera-team/germes-utils/stateMachine';
import isClone from '../helpers/isClone';
import clearCoupon from '../show_stake/clearCoupon';
import openBet from '../show_stake/openBet';

const loaderSelector = isClone()
  ? '.loading-bet:not([style="display: none;"])'
  : '[class*="common-loader__PreloaderWrap-sc"], svg.clock';

/* ---------------------------------- Клон ---------------------------------- */

const popUpSelector =
  '.js-popup:not([style="display: none;"]) .popup-error .js-txt';
const disabledBetSelctor = '.singles .item.betslip-disabled';
const oddsChangedSelector = '.odds_changed:not([style="display: none;"])';
const doneSelector = '.done:not([style="display: none;"])';

/* ---------------------------------- ЦУПИС --------------------------------- */

// const resultMessageSelector = '[class*="results__ResultsMessage-sc"]';
// const betCardSelector = '[class*="bet-card-wrap__BetCardWrap"]';

const errorSelector =
  'img[alt="status"][src="/public/8297d8229b6d049f4c11.svg"]';
const betSelector =
  '.sticky-column:last-child > :nth-child(1) > :nth-child(1) [href]';
const betPlacedSelector =
  'img[alt="status"][src="/public/99a2ddf60842ea1f823f.svg"]';

const sendTGBotMessage = (
  token: string,
  chatId: number,
  message: string
): Promise<Response> => {
  const timestamp = timeString(new Date());
  const fullMessage =
    `[${timestamp}]\n` +
    `[${worker.ApiKey}/${window.germesData.bookmakerName}]\n` +
    `${message.replace(/"/g, '\\"')}`;
  // eslint-disable-next-line no-useless-escape
  return fetch(`https:\/\/api.telegram.org/bot${token}/sendMessage`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"chat_id": "${chatId}","text": "${fullMessage}","disable_notification": false}`,
  });
};

const sendErrorMessage = (message: string): void => {
  worker.Helper.SendInformedMessage(
    `В ${window.germesData.bookmakerName} произошла ошибка принятия ставки:\n` +
      `${message}\n` +
      `${stakeInfoString()}`
  );
};

const sendDevTGBotMessage = (message: string): void => {
  sendTGBotMessage(
    '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
    126302051,
    message
  );
};

const asyncCheck = async () => {
  const machine = new StateMachine();

  machine.promises = {
    loader: () => getElement(loaderSelector, getRemainingTimeout()),
    ...(isClone()
      ? {
          popUp: () => getElement(popUpSelector, getRemainingTimeout()),
          disabledBet: () =>
            getElement(disabledBetSelctor, getRemainingTimeout()),
          oddsChanged: () =>
            getElement(oddsChangedSelector, getRemainingTimeout()),
          done: () => getElement(doneSelector, getRemainingTimeout()),
        }
      : {
          // resultMessage: () =>
          //   getElement(resultMessageSelector, getRemainingTimeout()),
          betPlaced: () => getElement(betPlacedSelector, getRemainingTimeout()),
          error: () => getElement(errorSelector, getRemainingTimeout()),
        }),
  };

  machine.setStates({
    start: {
      entry: async () => {
        log('Начало обработки ставки', 'steelblue');
      },
    },
    loader: {
      entry: async () => {
        log('Появился индикатор', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = 'индикатор';
        delete machine.promises.loader;
        machine.promises.loaderDissappeared = () =>
          awaiter(
            () => document.querySelector(loaderSelector) === null,
            getRemainingTimeout()
          );
      },
    },
    loaderDissappeared: {
      entry: async () => {
        log('Исчез индикатор', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = null;
        delete machine.promises.loaderDissappeared;
      },
    },

    /* ====================================================================== */
    /*                                  Клон                                  */
    /* ====================================================================== */

    popUp: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        log('Появилось всплывающее окно', 'steelblue');
        const errorText = text(machine.data.result as HTMLElement);
        log(errorText, 'tomato');
        // worker.Helper.SendInformedMessage(errorText);
        // sendTGBotMessage(
        //   '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
        //   126302051,
        //   errorText
        // );
        checkCouponLoadingError({});
        machine.end = true;
      },
    },
    disabledBet: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingError({
          botMessage: 'Ставка недоступна',
        });
        machine.end = true;
      },
    },
    oddsChanged: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingError({
          botMessage: 'Изменение коэффициента или исхода',
        });
        machine.end = true;
      },
    },
    done: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingSuccess('Ставка принята');
        machine.end = true;
      },
    },

    /* ====================================================================== */
    /*                                  ЦУПИС                                 */
    /* ====================================================================== */

    // resultMessage: {
    //   entry: async () => {
    //     window.germesData.betProcessingAdditionalInfo = null;
    //     // log('Появилась ошибка', 'steelblue');
    //     const resultMessage = text(machine.data.result as HTMLElement).replace(
    //       /^([a-zA-Z]*Icon)/,
    //       '$&\n'
    //     );
    //     log(resultMessage, 'tomato');
    //     if (/Ваша ставка успешно принята!/i.test(resultMessage)) {
    //       checkCouponLoadingSuccess('Ставка принята');
    //       machine.end = true;
    //       return;
    //     }
    //     if (
    //       /Соединение оборвалось. Попробуйте ещ[её] раз|Network Error/i.test(
    //         resultMessage
    //       )
    //     ) {
    //       checkCouponLoadingError({
    //         informMessage: resultMessage,
    //       });
    //       machine.end = true;
    //       window.location.reload();
    //       return;
    //     }
    //     // worker.Helper.SendInformedMessage(resultMessage);
    //     // sendTGBotMessage(
    //     //   '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
    //     //   126302051,
    //     //   resultMessage
    //     // );
    //     log('Ждём появления карточки ставки', 'steelblue');
    //     window.germesData.betProcessingStep = 'waitingForBetCard';
    //     const betCard = await getElement(betCardSelector, 20000);
    //     if (!betCard) {
    //       log('Карточка ставки не появилась', 'red');
    //       checkCouponLoadingError({});
    //       window.germesData.stakeDisabled = true;
    //       machine.end = true;
    //       return;
    //     }
    //     log('Появилась карточка ставки', 'steelblue');

    //     try {
    //       const couponCleared = await clearCoupon();
    //       if (!couponCleared) {
    //         throw new Error('Не удалось очистить купон');
    //       }
    //       await sleep(500);
    //       log('Переоткрываем ставку', 'orange');
    //       await openBet();
    //       log('Переоткрыли ставку', 'steelblue');
    //     } catch (e) {
    //       log(e.message, 'crimson');
    //     }
    //     checkCouponLoadingError({});
    //     machine.end = true;
    //   },
    // },
    error: {
      entry: async () => {
        log('Появилась ошибка', 'steelblue');
        const errorTextElement = (<HTMLElement>machine.data.result)
          .parentElement.nextElementSibling.nextElementSibling;
        if (!errorTextElement) {
          log('Не найден текст ошибки', 'crimson');
          window.germesData.stakeDisabled = true;
          checkCouponLoadingError({});
          machine.end = true;
          return;
        }
        const errorText = text(errorTextElement);
        log(errorText, 'tomato');
        if (/Выбранный Вами исход недоступен!/i.test(errorText)) {
          //
        } else if (/Сменился коэффициент на событие/i.test(errorText)) {
          //
        } else if (
          /Событие уже началось или снято с приема!/i.test(errorText)
        ) {
          //
        } else if (
          /Прием ставок на это событие приостановлен!/i.test(errorText)
        ) {
          //
        } else if (/Request failed with status code 502/i.test(errorText)) {
          //
        } else if (
          /Соединение оборвалось. Попробуйте еще раз/i.test(errorText)
        ) {
          //
        } else if (/Событие не найдено в корзине/i.test(errorText)) {
          //
        } else {
          sendErrorMessage(errorText);
          sendDevTGBotMessage(errorText);
        }
        log('Ждём появления карточки ставки', 'steelblue');
        window.germesData.betProcessingStep = 'waitingForBetCard';
        const betCard = await getElement(betSelector, 20000);
        if (!betCard) {
          log('Карточка ставки не появилась', 'red');
          checkCouponLoadingError({});
          window.germesData.stakeDisabled = true;
          machine.end = true;
          return;
        }
        log('Появилась карточка ставки', 'steelblue');

        try {
          const couponCleared = await clearCoupon();
          if (!couponCleared) {
            throw new Error('Не удалось очистить купон');
          }
          await sleep(500);
          log('Переоткрываем ставку', 'orange');
          await openBet();
          log('Переоткрыли ставку', 'steelblue');
        } catch (e) {
          log(e.message, 'crimson');
        }
        checkCouponLoadingError({});
        machine.end = true;
      },
    },
    betPlaced: {
      entry: async () => {
        checkCouponLoadingSuccess('Ставка принята');
        machine.end = true;
      },
    },
    timeout: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingError({
          botMessage: 'Не дождались результата ставки',
          informMessage: 'Не дождались результата ставки',
        });
        machine.end = true;
      },
    },
  });

  machine.start('start');
};

const checkCouponLoading = checkCouponLoadingGenerator({
  asyncCheck,
});

export default checkCouponLoading;
