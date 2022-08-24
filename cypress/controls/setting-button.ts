import {
  SetupControlSettings,
  getStoredVar,
  setStoredVar,
  ListenerSetting,
  FnVoid,
} from 'cy-ext';

export const settingButton: () => SetupControlSettings = () => {
  const color1 = '#d1dfff';
  const color2 = '#0e44fc';
  const varName = 'OTHER';
  const defaultValue = false;

  return {
    id: 'setting-btn',
    mode: { run: true, open: true },
    style: (parentId: string) => `#${parentId} {
        background-color: ${
          getStoredVar(varName, defaultValue) ? color1 : color2
        };
        color: #000;
        font-weight: bold;
      }
      #setting-label {
        padding:5px;
        color: ${getStoredVar(varName, defaultValue) ? color2 : color1};
      }`,

    control: () => {
      const val = getStoredVar(varName, defaultValue);

      return `
   <span id="setting-label">Setting:</span>
   <input id="setting-check" type="checkbox" ${val ? 'checked' : ''}/>
`;
    },

    addEventListener: (
      _parentId: string,
      listener: ListenerSetting,
      cyStop: FnVoid,
      cyRestart: FnVoid,
    ) => {
      Cypress.env(varName, getStoredVar(varName, defaultValue));

      listener('#setting-check', 'click', () => {
        const current = getStoredVar(varName, defaultValue);
        const newValue = current != null ? !current : defaultValue;

        setStoredVar(varName, JSON.stringify(newValue));

        console.log('Restarting...');
        cyRestart();
      });
    },
  };
};
