import { getElement, log } from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';
import JsFailError from './errors/jsFailError';

const openEvent = async (): Promise<void> => {
  // Клон
  if (isClone()) {
    // eslint-disable-next-line no-useless-return
    return;
  }
  // ЦУПИС
  log('Ищем событие', 'steelblue');
  const event = (await getElement(
    `.default__Link-sc-14zuwl2-0[href*="${worker.EventId}"]`
  )) as HTMLElement;
  if (!event) {
    throw new JsFailError('Событие не найдено');
  }
  log('Нашли событие', 'steelblue');
  event.click();
};

export default openEvent;
