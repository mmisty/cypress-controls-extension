import {
  SetupControlSettings,
  setupControlsExtensionWithEvent,
} from '../../src';

const defaultValue = true;

const setMock = (item: string, val: string) =>
  window.sessionStorage.setItem(item, val);

const getStoredVar = (item: string) => {
  const storage = window.sessionStorage.getItem(item);

  if (storage == null) {
    const envVar =
      Cypress.env(item) !== undefined ? Cypress.env(item) : defaultValue;
    setMock(item, envVar);
  }

  return JSON.parse(window.sessionStorage.getItem(item) ?? '');
};

export const mockButton: () => SetupControlSettings = () => {
  const ITEM_NAME = 'MOCK';

  return {
    id: 'myButton',

    mode: { run: true, open: true },

    style: (parentId) => {
      return `
    #${parentId} {
      background-color: ${
        getStoredVar(ITEM_NAME) ? '#569532' : 'rgb(160,44,145)'
      };
    }
  
    #turnMockOnLabel {
        padding:5px;
        color: ${getStoredVar(ITEM_NAME) ? '#fff' : '#fff'};
        font-weight: bold;
      }`;
    },

    control: () => {
      const val = getStoredVar(ITEM_NAME);

      return `
   <span id="turnMockOnLabel">Mock:</span>
   <input id="turnMockOn" type="checkbox" ${val ? 'checked' : ''}/>
`;
    },

    addEventListener: (
      listener: (selector: string, event: string, handler: () => void) => void,
      cyStop,
      cyRestart,
    ) => {
      Cypress.env(ITEM_NAME, getStoredVar(ITEM_NAME));

      listener('#turnMockOn', 'click', () => {
        const current = getStoredVar(ITEM_NAME);
        const newValue = current != null ? !current : defaultValue;

        setMock(ITEM_NAME, JSON.stringify(newValue));

        console.log('Restarting...');
        cyRestart();
      });
    },
  };
};

export const mockButton2: () => SetupControlSettings = () => {
  const color1 = '#d1dfff';
  const color2 = '#0e44fc';
  const varName = 'OTHER';

  return {
    id: 'myButton2',
    mode: { run: true, open: true },
    style: (parentId) => {
      return `#${parentId} {
        background-color: ${getStoredVar(varName) ? color1 : color2};
        color: #000;
        font-weight: bold;
      }
      #turnMockOnLabel2 {
        padding:5px;
        color: ${getStoredVar(varName) ? color2 : color1};
      }`;
    },
    control: () => {
      const val = getStoredVar(varName);

      return `
   <span id="turnMockOnLabel2">Setting:</span>
   <input id="turnMockOn2" type="checkbox" ${val ? 'checked' : ''}/>
`;
    },

    addEventListener: (
      listener: (selector: string, event: string, handler: () => void) => void,
      cyStop,
      cyRestart,
    ) => {
      Cypress.env(varName, getStoredVar(varName));

      listener('#turnMockOn2', 'click', () => {
        const current = getStoredVar(varName);
        const newValue = current != null ? !current : defaultValue;

        setMock(varName, JSON.stringify(newValue));

        console.log('Restarting...');
        cyRestart();
      });
    },
  };
};

setupControlsExtensionWithEvent([mockButton(), mockButton2()]);
