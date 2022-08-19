import {
  SetupControlSettings, setupControlsExtensionWithEvent,
} from '../../src';
console.log('LOADING');

const ITEM_NAME = 'MOCK';
const defaultValue = true;

const setMock = (item: string, val: string) => window.sessionStorage.setItem(item, val);

const getStoredVar = (item: string) => {
  const storage  = window.sessionStorage.getItem(item);
  
  if(storage == null){
    const envVar =  Cypress.env(item) !==undefined ?  Cypress.env(item) : defaultValue;
    setMock(item, envVar)
  }
  
  return JSON.parse(window.sessionStorage.getItem(item) ?? '');
}


export const mockButton: SetupControlSettings = {
  id: 'myButton',
  
  mode: { run: true, open: true },
  
  style: () => {
    return  `
      background-color: ${getStoredVar(ITEM_NAME) ? '#95e865' : '#ff79e4'};
      
      #turnMockOnLabel {
        padding:5px;
      }
      ` ;
  },
  
  control: () => {
    const val = getStoredVar(ITEM_NAME);
    
    return `
   <span id="turnMockOnLabel">Mock:</span>
   <input id="turnMockOn" type="checkbox" ${val ? 'checked' : ''}/>
`
  },

  addEventListener: (
    listener: (selector: string, event: string, handler: () => void) => void,
    cyStop,
    cyRestart,
  ) => {
    Cypress.env(ITEM_NAME, getStoredVar(ITEM_NAME));
    
    listener('#turnMockOn', 'click', () => {
      
      const current = getStoredVar(ITEM_NAME) ;
      const  newValue = current != null ? !current : defaultValue;
      
      
      setMock(ITEM_NAME, JSON.stringify(newValue));
  
      console.log('Restarting...')
      cyRestart();
    });
  },
};

export const mockButton2: SetupControlSettings = {
  id: 'myButton2',
  
  mode: { run: true, open: true },
  
  style: () => {
    return  `
      background-color: ${getStoredVar('OTHER') ? '#658ae8' : '#ffa179'};
      
      #turnMockOnLabel2 {
        padding:5px;
      }
      ` ;
  },
  
  control: () => {
    const val = getStoredVar('OTHER');
    
    return `
   <span id="turnMockOnLabel2">OTHER:</span>
   <input id="turnMockOn2" type="checkbox" ${val ? 'checked' : ''}/>
`
  },

  addEventListener: (
    listener: (selector: string, event: string, handler: () => void) => void,
    cyStop,
    cyRestart,
  ) => {
    Cypress.env('OTHER', getStoredVar('OTHER'));
    
    listener('#turnMockOn2', 'click', () => {
      
      const current = getStoredVar('OTHER') ;
      const  newValue = current != null ? !current : defaultValue;
      
      
      setMock('OTHER',JSON.stringify(newValue));
  
      console.log('Restarting...')
      cyRestart();
    });
  },
};


setupControlsExtensionWithEvent([mockButton, mockButton2]);