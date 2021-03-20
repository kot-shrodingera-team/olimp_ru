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
  if (window.location.href === worker.EventUrl) {
    log('Уже открыто нужное событие', 'steelblue');
    return;
  }
  const live = document.querySelector('[href="/live"]') as HTMLElement;
  if (!live) {
    throw new JsFailError('Не найдена кнопка перехода на Live');
  }
  log('Переходим на Live', 'orange');
  live.click();
  log('Ищем событие', 'steelblue');
  const event = (await getElement(
    `.default__Link-sc-14zuwl2-0[href*="${worker.EventId}"]`
  )) as HTMLElement;
  if (!event) {
    throw new JsFailError('Событие не найдено');
  }
  log('Переходим на событие', 'orange');
  event.click();
};

export default openEvent;
