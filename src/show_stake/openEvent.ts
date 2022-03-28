import { getElement, log } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import isClone from '../helpers/isClone';

const openEvent = async (): Promise<void> => {
  // Клон
  if (isClone()) {
    return;
  }
  // ЦУПИС

  // // https://www.olimp.bet/live/10/7052884/74315014
  // const urlRegex = /\/live\/(\d+)\/(\d+)\/(\d+)$/i;
  // https://www.olimp.bet/live/5/74347472
  const urlRegex = /\/live\/(\d+)\/(\d+)$/i;
  const urlMatch = worker.EventUrl.match(urlRegex);
  if (!urlMatch) {
    throw new JsFailError(
      'Не удалось распарсить адрес события. Обратитесь в ТП'
    );
  }

  const sportId = urlMatch[1];
  const eventId = urlMatch[2];

  const url = worker.EventUrl.replace(/(\d+)\/(\d+)$/, '$2');

  if (window.location.href === url) {
    log('Уже открыто нужное событие', 'steelblue');
    return;
  }

  const sportButton = await getElement<HTMLElement>(
    `[href="/live/${sportId}"]`
  );
  if (!sportButton) {
    throw new JsFailError('Не найдена кнопка нужного спорта');
  }
  sportButton.click();

  const eventButton = await getElement<HTMLElement>(
    `[href="/live/${sportId}/${eventId}"]`,
    10000
  );
  if (!eventButton) {
    throw new JsFailError('Событие не найдено');
  }
  log('Переходим на событие', 'orange');
  eventButton.click();
};

export default openEvent;
