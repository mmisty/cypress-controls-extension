import {
  cypressAppSelect,
  getStoredVar,
  ListenerSetting,
  removeControls,
  setStoredVar,
  setupControlsExtension,
} from 'cy-ext';

describe('check inject', () => {
  const clean = () => {
    Cypress.env('MY', undefined);
    cy.window().then((w) => w.sessionStorage.clear());
  };

  const control = (id: string, color: string) => ({
    id,
    inject: 'insertBefore',
    mode: { run: true, open: true },
    selectorToInject: 'header .stats',
    control: () => `<button class="myBut">My Label</button>`,
    style: (id: string) => `
          #${id} {
            background-color: ${color};
            
          }
          #${id} .myBut {
            background-color: ${color};
          }
    `,
    addEventListener: (parentId: string, listener: ListenerSetting) => {
      listener('#' + parentId + ' .myBut', 'click', () => {
        const myVar = (getStoredVar('MY', 0) ?? 0) + 1;
        setStoredVar('MY', myVar.toString());
        Cypress.env('MY', myVar);
        Cypress.log({ name: 'Click .myBut' + id });
      });
    },
  });

  describe('inject ', () => {
    beforeEach(() => {
      setupControlsExtension(control('id1', '#fff'));
      setupControlsExtension(control('id2', 'red'));
    });

    after(() => {
      clean();
    });

    it(' mode', () => {
      cypressAppSelect('#controlWrapper-id1 .myBut').trigger('click');
      expect(Cypress.env('MY')).eq(1);

      cypressAppSelect('#controlWrapper-id2 .myBut').trigger('click');
      expect(Cypress.env('MY')).eq(2);
    });
  });
});
