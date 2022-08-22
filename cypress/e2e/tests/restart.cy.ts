import {
  cypressAppSelect,
  setupControlsExtensionWithEvent,
  ListenerSetting,
  FnVoid,
} from 'cy-ext';
import { getStoredVar, setStoredVar } from '../../controls/common';

describe('restart', () => {
  setupControlsExtensionWithEvent({
    id: 'myButton',
    control: () => {
      return `
   <button id="turnMockOn" >MyBut</button>
`;
    },

    addEventListener: (
      _parentId: string,
      listener: ListenerSetting,
      cyStop: FnVoid,
      cyRestart: FnVoid,
    ) => {
      listener('#turnMockOn', 'click', () => {
        const counter = getStoredVar('COUNTER', 0) + 1;
        setStoredVar('COUNTER', `${counter}`);
        console.log('Restarting...');

        cyStop();
        cyRestart();
      });
    },
  });

  it('should restart', () => {
    const counter = getStoredVar('COUNTER', 0);

    if (counter === 0) {
      cypressAppSelect('#turnMockOn').trigger('click');
      throw new Error('Should be Unreachable');
    } else {
      expect(counter).eq(1);
      cy.window().then((w) => w.sessionStorage.clear());
    }
  });
});
