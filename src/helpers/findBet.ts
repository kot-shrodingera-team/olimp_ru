import { awaiter } from '@kot-shrodingera-team/germes-utils';
import { getReactInstance } from '@kot-shrodingera-team/germes-utils/reactUtils';
import { OutcomeGroup, OutcomeGroupList } from '../bookmakerApi';

const findBet = async (reactKey: number): Promise<OutcomeGroup> => {
  return awaiter(
    () => {
      const outcomeGroups = [
        ...document.querySelectorAll(
          '[class*="FullMatchStyled"] [class*="GroupOutcomes"]'
        ),
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const outcomeGroup of outcomeGroups) {
        if (!outcomeGroup.querySelector('ul')) {
          outcomeGroup.querySelector('div').click();
        }
        const outcomeGroupLists = [
          ...outcomeGroup.querySelectorAll('ul[class*="List"]'),
        ];

        // eslint-disable-next-line no-restricted-syntax
        for (const outcomeGroupList of outcomeGroupLists) {
          // console.log(outcomeGroupList.previousElementSibling.textContent);
          const result = (
            getReactInstance(outcomeGroupList) as OutcomeGroupList
          ).memoizedProps.children.find((currentOutcome) => {
            // console.log(
            //   `${currentOutcome.props.children.props.name} - ${currentOutcome.props.children.props.id}`
            // );
            return currentOutcome.props.children.props.id === reactKey;
          });
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    5000,
    100
  );
};

export default findBet;
