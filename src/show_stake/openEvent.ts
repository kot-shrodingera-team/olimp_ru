import { getElement, log } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import isClone from '../helpers/isClone';

const openEvent = async (): Promise<void> => {
  // Клон
  if (isClone()) {
    return;
  }
  // ЦУПИС
  if (window.location.href === worker.EventUrl) {
    log('Уже открыто нужное событие', 'steelblue');
    return;
  }
  const live = document.querySelector<HTMLElement>('[href="/live"]');
  if (!live) {
    throw new JsFailError('Не найдена кнопка перехода на Live');
  }
  log('Переходим на Live', 'orange');
  live.click();
  log('Ищем событие', 'steelblue');
  const event = await getElement<HTMLElement>(
    `.default__Link-sc-14zuwl2-0[href*="${worker.EventId}"]`
  );
  if (!event) {
    throw new JsFailError('Событие не найдено');
  }
  log('Переходим на событие', 'orange');
  event.click();
};

export default openEvent;
