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
  if (window.germesData && window.germesData.updateManualDataIntervalId) {
    clearInterval(window.germesData.updateManualDataIntervalId);
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
    updateManualDataIntervalId: undefined,
    stopUpdateManualData: undefined,
    manualMaximumStake: undefined,
    manualCoefficient: undefined,
    manualParameter: undefined,
    manualStakeEnabled: undefined,
  };
};

export default {};
