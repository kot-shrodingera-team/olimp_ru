import isClone from './helpers/isClone';

export interface OlimpCloneBet {
  deleted: boolean;
  value: number;
  vmaxbet: string;
}

export interface OutcomeGroup {
  props: {
    children: {
      props: {
        id: number;
        name: string;
        onClick: () => void;
      };
    };
  };
}

export interface OutcomeGroupList {
  memoizedProps: {
    children: OutcomeGroup[];
  };
}

interface OlimpBetslip {
  [key: string]: OlimpCloneBet;
}

declare global {
  // interface GermesData {}
  interface Window {
    betslip: OlimpBetslip;
    betAdd: (
      id: string,
      sid: string,
      mtype: string,
      value: string,
      value1: string
    ) => unknown;
    betClear: () => unknown;
  }
}

export const clearGermesData = (): void => {
  if (window.germesData && window.germesData.updateMaximumIntervalId) {
    clearInterval(window.germesData.updateMaximumIntervalId);
  }
  if (window.germesData && window.germesData.updateCoefIntervalId) {
    clearInterval(window.germesData.updateCoefIntervalId);
  }
  window.germesData = {
    bookmakerName: isClone() ? 'BetOlimp' : 'Olimp.Bet',
    minimumStake: undefined,
    maximumStake: undefined,
    doStakeTime: undefined,
    betProcessingStep: undefined,
    betProcessingAdditionalInfo: undefined,
    betProcessingTimeout: 50000,
    stakeDisabled: undefined,
    stopBetProcessing: () => {
      window.germesData.betProcessingStep = 'error';
      window.germesData.stakeDisabled = true;
    },
    updateMaximumIntervalId: undefined,
    updateCoefIntervalId: undefined,
    manualMax: undefined,
    manualCoef: undefined,
  };
};

export default {};
