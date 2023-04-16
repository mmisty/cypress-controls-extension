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
    mode,
  });

  [
    { mode: { open: true } },
    { mode: { open: true, run: true } },
    { mode: { open: true, run: false } },
    { mode: undefined },
  ].forEach((m) => {
    describe(JSON.stringify(m), () => {
      beforeEach(() => {
        setupControlsExtension(control(undefined));
      });

      after(() => {
        removeControls(control(undefined));
        clean();
      });

      it('open mode', () => {
        cypressAppSelect('#myBut').trigger('click');
        expect(Cypress.env('MY')).eq(1);

        cypressAppSelect('#myBut').trigger('click');
        expect(Cypress.env('MY')).eq(2);
      });

      it('open mode2', () => {
        cypressAppSelect('#myBut').trigger('click');
        expect(Cypress.env('MY')).eq(4);
      });
    });
  });
});
