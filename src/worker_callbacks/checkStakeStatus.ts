import { log, stakeInfoString } from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';
import { updateBalance } from '../stake_info/getBalance';

const checkStakeStatus = (): boolean => {
  // Клон
  if (isClone()) {
    const popupError = document.querySelector(
      '.js-popup:not([style="display: none;"]) .popup-error'
    );
    if (popupError) {
      const popupErrorTextElement = popupError.querySelector('.js-txt');
      if (!popupErrorTextElement) {
        log('Не найден текст ошибки ставки. Ставка не принята', 'red');
        return false;
      }
      const popupErrorText = popupErrorTextElement.textContent.trim();
      log(`Ошибка ставки: "${popupErrorText}"`, 'tomato');
      return false;
    }
    const doneElement = document.querySelector(
      '.done:not([style="display: none;"])'
    );
    if (doneElement) {
      log('Ставка принята', 'green');
      return true;
    }
    const disabledBet = document.querySelector(
      '.singles .item.betslip-disabled'
    );
    if (disabledBet) {
      log('Ставка недоступна. Ставка не принята', 'tomato');
      return false;
    }
    const oddsChanged = document.querySelector(
      '.odds_changed:not([style="display: none;"])'
    );
    if (oddsChanged) {
      log('Изменение коэффициента или исхода. Ставка не принята', 'tomato');
      return false;
    }
    log('Непонятный результат. Ставка не принята', 'red');
    return false;
  }
  // ЦУПИС
  const resultMessageElement = document.querySelector(
    '.results__ResultsMessage-sc-7a3lgm-0'
  );
  if (resultMessageElement) {
    const resultMessage = resultMessageElement.textContent.trim();
    if (resultMessage === 'Ваша ставка успешно принята!') {
      log('Ставка принята', 'green');
      updateBalance();
      return true;
    }
    if (resultMessage === 'Соединение оборвалось. Попробуйте ещё раз') {
      const message =
        `В Olimp ошибка ставки "Соединение оборвалось. Попробуйте ещё раз"\n` +
        `${stakeInfoString()}\n` +
        `Ставка засчитана как НЕ принятая. Желательно проверить вручную\n`;
      worker.Helper.SendInformedMessage(message);
      log('Ошибка соединения. Считаем ставку не принятой', 'red');
      return false;
    }
    log(`Результат ставки: "${resultMessage}"`, 'tomato');
    log('Ставка не принята', 'red');
    return false;
  }
  const betCard = document.querySelector(
    '.bet-card-wrap__BetCardWrap-muhxrm-0'
  );
  if (betCard) {
    log('Повилась карточка ставки. Ставка не принята', 'red');
    return false;
  }
  log('Не найден результат. Ставка не принята', 'red');
  return false;
};

export default checkStakeStatus;
