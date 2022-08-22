import { ListenerSetting, setupControlsExtension, FnVoid } from 'cy-ext';
import { getStoredVar, setStoredVar } from '../../controls/common';

describe('suite', () => {
  const but = {
    id: 'myButton',
    control: () => `<button id="turnMockOn" >MyBut</button>`,

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
  };

  it('should throw error when non-uniq ids used', () => {
    const t = () => setupControlsExtension(but, but);
    expect(t).to.throws(
      'cypress-cotrols-extension: Controls should have uniq ids: ["myButton","myButton"]',
    );
  });
});
