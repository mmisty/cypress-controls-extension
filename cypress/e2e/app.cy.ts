import {
  setupControlsExtension,
  removeControls,
  cypressAppSelect,
} from 'cy-ext';
import { mockButton } from '../controls/mock-button';

describe('test mock button', () => {
  const item = 'MOCK';
  const initial = true;
  const setup = () => setupControlsExtension(mockButton(initial, false));
  const el = () => cypressAppSelect('.turn-mock-on');
  const click = () => el().trigger('click');
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
    });

    it('should handle click event - toggle value', () => {
      click();

      expect(el().attr('data-value'), 'Cypress env').eq('unchecked');
    });

    it('should handle click event - toggle value 2 times', () => {
      click();
      click();

      expect(el().attr('data-value'), 'Cypress env').eq('checked');
    });

    it('should handle click event - toggle value three times', () => {
      click();
      click();
      click();

      expect(el().attr('data-value'), 'Cypress env').eq('unchecked');
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

      expect(el().attr('data-value'), 'Cypress env').eq('unchecked');
    });

    it('should handle click event - toggle value second', () => {
      click();

      expect(el().attr('data-value'), 'Cypress env').eq('checked');
    });
  });
});
