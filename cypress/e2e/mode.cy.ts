import {
  cypressAppSelect,
  removeControls,
  setupControlsExtension,
  setupControlsExtensionWithEvent,
} from 'cy-ext';
import { getStoredVar, setStoredVar } from '../controls/common';
import { mockButton } from '../controls/mock-button';

describe('check mode', () => {
  const clean = () => {
    Cypress.env('MY', undefined);
    cy.window().then((w) => w.sessionStorage.clear());
  };
  const control = (mode) => ({
    id: 'labelId',
    control: () => `<button id="myBut">My Label</button>`,
    addEventListener: (_parentId, listener) => {
      console.log(_parentId);
      listener('#myBut', 'click', () => {
        const myVar = getStoredVar('MY', 0) + 1;
        setStoredVar('MY', myVar.toString());
        Cypress.env('MY', myVar);
        Cypress.log({ name: 'Click #myBut' });
      });
    },
    mode,
  });

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
