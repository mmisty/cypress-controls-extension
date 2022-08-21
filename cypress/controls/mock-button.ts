import { SetupControlSettings } from 'cy-ext';
import { getStoredVar, setStoredVar, updateEnvVar } from './common';

export const mockButton: (
  defaultValue: boolean,
  isRestart?: boolean,
) => SetupControlSettings = (defaultValue: boolean, isRestart = true) => {
  const ITEM_NAME = 'MOCK';
  return {
    mode: { run: true, open: true },
    id: 'myButton',
    style: (parentId) => `
    #${parentId} {
      background-color: ${
        getStoredVar(ITEM_NAME, defaultValue) ? '#569532' : 'rgb(160,44,145)'
      };
    }
  
    #turnMockOnLabel {
        padding:5px;
        color: ${getStoredVar(ITEM_NAME, defaultValue) ? '#fff' : '#fff'};
        font-weight: bold;
      }`,

    control: () => {
      const val = getStoredVar(ITEM_NAME, defaultValue);

      return `
   <span id="turnMockOnLabel">Mock:</span>
   <input id="turnMockOn" type="checkbox" ${val ? 'checked' : ''}/>
`;
    },

    addEventListener: (
      _parentId,
      listener: (
        selector: string,
        event: string,
        handler: (target: Event) => void,
      ) => void,
      cyStop,
      cyRestart,
    ) => {
      updateEnvVar(ITEM_NAME, defaultValue);

      listener('#turnMockOn', 'click', () => {
        Cypress.log({ name: 'CLICK', message: '#turnMockOn' });
        const current = getStoredVar(ITEM_NAME, defaultValue);
        const newValue = current != null ? !current : defaultValue;

        setStoredVar(ITEM_NAME, JSON.stringify(newValue));
        updateEnvVar(ITEM_NAME, defaultValue);

        if (isRestart) {
          console.log('Restarting...');

          cyRestart();
        }
      });
    },
  };
};
