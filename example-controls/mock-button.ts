import { SetupControlSettings } from '../src';
import { getStoredVar, setStoredVar } from '../cypress/controls/common';

export const mockButton: () => SetupControlSettings = () => {
  const ITEM_NAME = 'MOCK';
  const defaultValue = true;

  return {
    id: 'myButton',

    mode: { run: true, open: true },

    style: (parentId) => {
      return `
    #${parentId} {
      background-color: ${
        getStoredVar(ITEM_NAME, defaultValue) ? '#569532' : 'rgb(160,44,145)'
      };
    }`;
    },

    control: () => {
      const val = getStoredVar(ITEM_NAME, defaultValue);

      return `
   <span id="turnMockOnLabel">Mock:</span>
   <input id="turnMockOn" type="checkbox" ${val ? 'checked' : ''}/>
`;
    },

    addEventListener: (
      parentId,
      listener: (selector: string, event: string, handler: () => void) => void,
      cyStop,
      cyRestart,
    ) => {
      Cypress.env(ITEM_NAME, getStoredVar(ITEM_NAME, defaultValue));

      listener('#turnMockOn', 'click', () => {
        const current = getStoredVar(ITEM_NAME, defaultValue);
        const newValue = current != null ? !current : defaultValue;

        setStoredVar(ITEM_NAME, JSON.stringify(newValue));

        console.log('Restarting...');
        cyRestart();
      });
    },
  };
};
