import {
  SetupControlSettings,
  ListenerSetting,
  getStoredVar,
  updateEnvVar,
  FnVoid,
  cypressAppSelect,
} from 'cy-ext';

export const mockButton: (
  defaultValue: boolean,
  isRestart?: boolean,
) => SetupControlSettings = (defaultValue: boolean, isRestart = true) => {
  const ITEM_NAME = 'MOCK';
  return {
    mode: { run: true, open: true },
    id: 'myButton',
    style: (parentId: string) => `
    #${parentId} {
    
    }
  
    #${parentId} .turn-mock-on-label {
        padding:5px;
        color: #fff;
        font-weight: bold;
      }
      
    #${parentId}:has(.turn-mock-on[data-value=checked]){
       color: red;
       background-color:#569532;
    }
    
    #${parentId}:has(.turn-mock-on[data-value=unchecked]){
       color: red;
       background-color:#c07bcb;
    }
    `,

    control: () => {
      // this will run only for first time after app is loaded
      const val = getStoredVar(ITEM_NAME, defaultValue);
      return `
         <span class="turn-mock-on-label">Mock:</span>
         <input class="turn-mock-on" type="checkbox"  data-value="${
           val === true ? 'checked' : 'unchecked'
         }" ${val === true ? 'checked' : ''}/>
      `;
    },

    addEventListener: (
      parentId: string,
      listener: ListenerSetting,
      cyStop: FnVoid,
      cyRestart: FnVoid,
    ) => {
      updateEnvVar(ITEM_NAME, defaultValue);

      listener(`#${parentId} .turn-mock-on`, 'click', () => {
        updateEnvVar(ITEM_NAME, !defaultValue);
        const element = cypressAppSelect(`#${parentId} .turn-mock-on`);
        const value = element.attr('data-value');
        element.attr(
          'data-value',
          value === 'checked' ? 'unchecked' : 'checked',
        );

        if (isRestart) {
          console.log('Restarting...');

          cyRestart();
        }
      });
    },
  };
};
