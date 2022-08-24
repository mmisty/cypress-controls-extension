import {
  setupControlsExtension,
  removeControls,
  cypressAppSelect,
  getStoredVar,
} from 'cy-ext';
import { mockButton } from '../controls/mock-button';

describe('test mock button', () => {
  const item = 'MOCK';
  const initial = true;
  const setup = () => setupControlsExtension(mockButton(initial, false));
  const click = () => cypressAppSelect('#turnMockOn').trigger('click');
  const clean = () => {
    Cypress.env('MOCK', undefined);
    cy.window().then((w) => w.sessionStorage.clear());
    removeControls(mockButton(initial, false));
  };

  describe('should handle click', () => {
    beforeEach(() => {
      setup();
    });

    afterEach(() => {
      clean();
    });

    it('should have initial value', () => {
      expect(Cypress.env(item), 'Cypress env').eq(initial);
      expect(getStoredVar(item, initial), 'session storage').eq(initial);
    });

    it('should handle click event - toggle value', () => {
      click();

      expect(Cypress.env(item), 'Cypress env').eq(!initial);
      expect(getStoredVar(item, initial), 'session storage').eq(!initial);
    });

    it('should handle click event - toggle value 2 times', () => {
      click();
      click();

      expect(Cypress.env(item), 'Cypress env').eq(initial);
      expect(getStoredVar(item, initial), 'session storage').eq(initial);
    });

    it('should handle click event - toggle value three times', () => {
      click();
      click();
      click();

      expect(getStoredVar(item, initial), 'session storage').eq(!initial);
    });
  });

  describe('should store between tests', () => {
    before(() => {
      setup();
    });

    after(() => {
      clean();
    });

    it('should handle click event - toggle value ', () => {
      click();

      expect(Cypress.env(item), 'Cypress env').eq(!initial);
      expect(getStoredVar(item, initial), 'session storage').eq(!initial);
    });

    it('should handle click event - toggle value second', () => {
      click();

      expect(Cypress.env(item), 'Cypress env').eq(initial);
      expect(getStoredVar(item, initial), 'session storage').eq(initial);
    });
  });
});
