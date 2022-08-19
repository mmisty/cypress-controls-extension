import {
  SetupControlSettings,
} from '../src';

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
  
  style: (parentId) => {
    return  `
    #${parentId} {
      background-color: ${getStoredVar(ITEM_NAME) ? '#569532' : 'rgb(160,44,145)'};
    }
  
    #turnMockOnLabel {
        padding:5px;
        color: ${getStoredVar(ITEM_NAME) ? '#fff' : '#fff'};;
        font-weight: bold;
      }` ;
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