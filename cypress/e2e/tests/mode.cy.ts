import {
  cypressAppSelect,
  removeControls,
  setupControlsExtension,
  ListenerSetting,
  ModeSetting,
  getStoredVar,
  setStoredVar,
} from 'cy-ext';

describe('check mode', () => {
  const clean = () => {
    Cypress.env('MY', undefined);
    cy.window().then((w) => w.sessionStorage.clear());
  };

  const control = (mode?: ModeSetting) => ({
    id: 'labelId',
    control: () => `<button id="myBut">My Label</button>`,
    addEventListener: (_parentId: string, listener: ListenerSetting) => {
      listener('#myBut', 'click', () => {
        const myVar = (getStoredVar('MY', 0) ?? 0) + 1;
        setStoredVar('MY', myVar.toString());
        Cypress.env('MY', myVar);
        Cypress.log({ name: 'Click #myBut' });
      });
    },
    ...mode,
  });

  [
    {
      desc: 'only open',
      mode: { open: true },
      exp: Cypress.config('isInteractive'),
    },
    {
      desc: 'only open',
      mode: { open: false },
      exp: false,
    },
    { desc: 'both true', mode: { open: true, run: true }, exp: true },
    {
      desc: 'only open, run false',
      mode: { open: true, run: false },
      exp: Cypress.config('isInteractive'),
    },
    {
      desc: 'both false',
      mode: { open: false, run: false },
      exp: false,
    },
    {
      desc: 'both undefined',
      mode: undefined,
      exp: Cypress.config('isInteractive'),
    },
  ].forEach((m) => {
    describe(m.desc, () => {
      beforeEach(() => {
        setupControlsExtension(control(m));
      });

      after(() => {
        removeControls(control(undefined));
        clean();
      });

      it('open mode', () => {
        const button = cypressAppSelect('#myBut');
        if (m.exp) {
          expect(button.length).eq(1);

          button.trigger('click');
          expect(Cypress.env('MY')).eq(1);

          button.trigger('click');
          expect(Cypress.env('MY')).eq(2);
        } else {
          expect(button.length, 'no button injected').eq(0);
        }
      });

      it('open mode2', () => {
        const button = cypressAppSelect('#myBut');
        if (m.exp) {
          button.trigger('click');
          expect(Cypress.env('MY')).eq(4);
        }
      });
    });
  });
});
