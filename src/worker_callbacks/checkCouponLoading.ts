import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import {
  log,
  getElement,
  awaiter,
  getRemainingTimeout,
  checkCouponLoadingError,
  checkCouponLoadingSuccess,
  text,
  // sendTGBotMessage,
} from '@kot-shrodingera-team/germes-utils';
import { StateMachine } from '@kot-shrodingera-team/germes-utils/stateMachine';
import isClone from '../helpers/isClone';
import openBet from '../show_stake/openBet';

const loaderSelector = isClone()
  ? '.loading-bet:not([style="display: none;"])'
  : '[class*="common-loader__PreloaderWrap-sc"]';

const popUpSelector =
  '.js-popup:not([style="display: none;"]) .popup-error .js-txt';
const disabledBetSelctor = '.singles .item.betslip-disabled';
const oddsChangedSelector = '.odds_changed:not([style="display: none;"])';
const doneSelector = '.done:not([style="display: none;"])';

const resultMessageSelector = '[class*="results__ResultsMessage-sc"]';
const betCardSelector = '[class*="bet-card-wrap__BetCardWrap"]';

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
          resultMessage: () =>
            getElement(resultMessageSelector, getRemainingTimeout()),
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

    resultMessage: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        // log('Появилась ошибка', 'steelblue');
        const resultMessage = text(machine.data.result as HTMLElement).replace(
          /^([a-zA-Z]*Icon)/,
          '$&\n'
        );
        log(resultMessage, 'tomato');
        if (/Ваша ставка успешно принята!/i.test(resultMessage)) {
          checkCouponLoadingSuccess('Ставка принята');
          machine.end = true;
          return;
        }
        if (
          /Соединение оборвалось. Попробуйте ещ[её] раз|Network Error/i.test(
            resultMessage
          )
        ) {
          checkCouponLoadingError({
            informMessage: resultMessage,
          });
          machine.end = true;
          window.location.reload();
          return;
        }
        // worker.Helper.SendInformedMessage(resultMessage);
        // sendTGBotMessage(
        //   '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
        //   126302051,
        //   resultMessage
        // );
        log('Ждём появления карточки ставки', 'steelblue');
        window.germesData.betProcessingStep = 'waitingForBetCard';
        const betCard = await getElement(betCardSelector, 20000);
        if (!betCard) {
          log('Карточка ставки не появилась', 'steelblue');
        } else {
          log('Появилась карточка ставки', 'steelblue');
        }
        try {
          await openBet();
          log('Переоткрыли ставку', 'steelblue');
        } catch (e) {
          log(e.message, 'crimson');
        }
        checkCouponLoadingError({});
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
