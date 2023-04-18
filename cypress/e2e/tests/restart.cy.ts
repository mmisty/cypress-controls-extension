import {
  cypressAppSelect,
  setupControlsExtensionWithEvent,
  ListenerSetting,
  FnVoid,
} from 'cy-ext';

const setVal = (n: number) => {
  cypressAppSelect('.turn-mock-on').attr('data-counter', `${n}`);
};

const getVal = () => {
  const counter = cypressAppSelect('.turn-mock-on').attr('data-counter');
  if (counter) {
    return parseInt(`${counter}`);
  }
  setVal(0);
  return 0;
};

describe('restart', () => {
  setupControlsExtensionWithEvent({
    id: 'myButton',
    mode: { run: true, open: true },
    control: () => {
      return `
   <button class="turn-mock-on" >MyBut</button>
`;
    },

    addEventListener: (
      _parentId: string,
      listener: ListenerSetting,
      cyStop: FnVoid,
      cyRestart: FnVoid,
    ) => {
      listener('.turn-mock-on', 'click', () => {
        const n = getVal() + 1;
        setVal(n);
        console.log('Restarting...' + n);

        cyStop();
        cyRestart();
      });
    },
  });

  it('should restart', () => {
    //const counter = getStoredVar('COUNTER', 0);
    const v = getVal();
    if (v < 3) {
      cypressAppSelect('.turn-mock-on').trigger('click');
      throw new Error('Should be Unreachable');
    } else {
      expect(v).eq(3);
      cy.window().then((w) => w.sessionStorage.clear());
    }
  });
});
