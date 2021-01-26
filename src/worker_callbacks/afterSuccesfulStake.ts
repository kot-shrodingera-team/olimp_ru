// import isClone from '../isClone';

let currentCoefficient = 0;

export const setCurrentCoefficient = (newCurrentCoefficient: number): void => {
  currentCoefficient = newCurrentCoefficient;
};

export const getCurrentCoefficient = (): number => {
  return currentCoefficient;
};

export const clearCurrentCoefficient = (): void => {
  currentCoefficient = 0;
};

const afterSuccesfulStake = (): void => {
  // // Клон
  // if (isClone()) {
  //   return;
  // }
  // // ЦУПИС
  // return;
};

export default afterSuccesfulStake;
