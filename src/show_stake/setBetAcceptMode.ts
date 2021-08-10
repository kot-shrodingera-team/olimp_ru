import { log, ri, text } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import isClone from '../helpers/isClone';

const setBetAcceptMode = async (): Promise<void> => {
  if (isClone()) {
    log('В BetOlimp не реализована смена режима принятия ставки', 'crimson');
    return;
  }

  const modes = ['Никогда', 'При повышении', 'Всегда'];
  const betAcceptModeActiveElement = document.querySelector(
    '[class*="settings__SettingsTab-"].active'
  );
  if (!betAcceptModeActiveElement) {
    throw new JsFailError('Не найдена текущая опция режима принятия ставки');
  }
  const betAcceptModeActive = text(betAcceptModeActiveElement);
  const targetMode = modes[worker.StakeAcceptRuleShoulder];

  if (ri`${targetMode}`.test(betAcceptModeActive)) {
    log(
      `Уже выбран режим принятия ставки "${betAcceptModeActive}"`,
      'steelblue'
    );
    return;
  }

  const betAcceptModes = [
    ...document.querySelectorAll<HTMLElement>(
      '[class*="settings__SettingsTab-"]'
    ),
  ];
  const targetModeElement = betAcceptModes.find((mode) =>
    ri`${targetMode}`.test(text(mode))
  );
  if (!targetModeElement) {
    throw new JsFailError(
      `Не найдена опция режима принятия ставки "${targetMode}"`
    );
  }
  log(
    `Переключаем режим принятия ставки с "${betAcceptModeActive}" на "${targetMode}"`,
    'orange'
  );
  targetModeElement.click();
};

export default setBetAcceptMode;
