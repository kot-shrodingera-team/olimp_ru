import { log } from '@kot-shrodingera-team/germes-utils';
import { version } from '../package.json';
import showStake from './show_stake';

const clearGermesData = () => {
  window.germesData = {
    betProcessingStep: undefined,
    betProcessingAdditionalInfo: undefined,
    doStakeTime: undefined,
  };
};

const fastLoad = async (): Promise<void> => {
  log(`Быстрая загрузка (${version})`, 'steelblue');
  if (worker.GetSessionData('OlimpRu.WaitingForSendSMSButton') === '1') {
    log(
      'Не закончена авторизация. Ожидается появление кнопки отправки смс',
      'red'
    );
    worker.JSFail();
    return;
  }
  clearGermesData();
  showStake();
};

export default fastLoad;
