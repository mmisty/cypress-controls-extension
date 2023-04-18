import {
  cypressAppSelect,
  getStoredVar,
  ListenerSetting,
  removeControls,
  setStoredVar,
  setupControlsExtension,
  SetupControlSettings,
} from 'cy-ext';

describe('check inject', () => {
  const clean = () => {
    Cypress.env('MY', undefined);
    cy.window().then((w) => w.sessionStorage.clear());
  };

  const control = (inject: string): SetupControlSettings => ({
    id: 'labelId',
    mode: { run: true, open: true },
    inject: inject,
    selectorToInject: 'header .stats',
    control: () => `<button id="myBut">My Label</button>`,
    addEventListener: (parentId: string, listener: ListenerSetting) => {
      listener(`#${parentId} #myBut`, 'click', () => {
        const myVar = (getStoredVar('MY', 0) ?? 0) + 1;
        setStoredVar('MY', myVar.toString());
        Cypress.env('MY', myVar);
        Cypress.log({ name: 'Click #myBut' });
      });
    },
  });

  ['insertBefore', 'insertAfter', 'start', 'end'].forEach((opt) => {
    describe('inject ' + opt, () => {
      beforeEach(() => {
        setupControlsExtension(control(opt));
      });

      after(() => {
        removeControls(control(opt));
        clean();
      });

      it(opt + ' mode', () => {
        cypressAppSelect('#myBut').trigger('click');
        expect(Cypress.env('MY')).eq(1);

        cypressAppSelect('#myBut').trigger('click');
        expect(Cypress.env('MY')).eq(2);
      });
    });
  });
});
