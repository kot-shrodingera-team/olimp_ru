import { log } from '@kot-shrodingera-team/germes-utils';
import isClone from '../isClone';

const setBetAcceptMode = (): boolean => {
  if (isClone()) {
    return true;
    const betAcceptModes = [
      ...document.querySelectorAll('.settings__SettingsTab-sc-1labr3k-2'),
    ] as HTMLElement[];
    const mode = ((): HTMLElement => {
      switch (worker.StakeAcceptRuleShoulder) {
        case 0:
          return betAcceptModes.find(
            (element) => element.textContent.trim() === 'Никогда'
          );
        case 1:
          return betAcceptModes.find(
            (element) => element.textContent.trim() === 'При повышении'
          );
        case 2:
          return betAcceptModes.find(
            (element) => element.textContent.trim() === 'Всегда'
          );
        default:
          return null;
      }
    })();
    if (!mode) {
      log('Не найдена нужная опция режима принятия ставки', 'crimson');
      return false;
    }
    mode.click();
    return true;
  }
  const betAcceptModes = [
    ...document.querySelectorAll('.settings__SettingsTab-sc-1labr3k-2'),
  ] as HTMLElement[];
  const mode = ((): HTMLElement => {
    switch (worker.StakeAcceptRuleShoulder) {
      case 0:
        return betAcceptModes.find(
          (element) => element.textContent.trim() === 'Никогда'
        );
      case 1:
        return betAcceptModes.find(
          (element) => element.textContent.trim() === 'При повышении'
        );
      case 2:
        return betAcceptModes.find(
          (element) => element.textContent.trim() === 'Всегда'
        );
      default:
        return null;
    }
  })();
  if (!mode) {
    log('Не найдена нужная опция режима принятия ставки', 'crimson');
    return false;
  }
  mode.click();
  return true;
};

export default setBetAcceptMode;
