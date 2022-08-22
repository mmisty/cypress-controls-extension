import { setupControlsExtensionWithEvent } from 'cy-ext';
import { mockButton } from '../controls/mock-button';

describe('demo', () => {
  // this you can put into support/index.ts file when you need i in every test file
  setupControlsExtensionWithEvent(mockButton(true, true));

  it('should show different message on clicking on mock-button', () => {
    cy.log(
      Cypress.env('MOCK') ? 'Running on **MOCK**' : 'Running on **SERVER**',
    );
  });
});
