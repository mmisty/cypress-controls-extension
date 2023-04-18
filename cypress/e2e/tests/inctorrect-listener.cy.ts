import {
  ListenerSetting,
  setupControlsExtension,
  FnVoid,
  getStoredVar,
  setStoredVar,
  cypressAppSelect,
} from 'cy-ext';

describe('suite', () => {
  const but = {
    id: 'myButton',
    control: () => `<button id="turnMockOn" >MyBut</button>`,
    mode: { run: true, open: true },
    addEventListener: (
      _parentId: string,
      listener: ListenerSetting,
      cyStop: FnVoid,
      cyRestart: FnVoid,
    ) => {
      listener('#myMyMyIncorrect', 'click', () => {
        const counter = (getStoredVar('COUNTER', 0) ?? 0) + 1;
        setStoredVar('COUNTER', `${counter}`);
        console.log('Restarting...');

        cyStop();
        cyRestart();
      });
    },
  };

  it('should show warning when not found element', () => {
    setupControlsExtension(but);
    expect(cypressAppSelect('#turnMockOn').length).eq(1);
    // todo mock console
  });
});
