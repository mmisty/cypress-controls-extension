import { cypressAppSelect, setupControlsExtensionWithEvent } from 'cy-ext';
import { mockButton } from '../controls/mock-button';

describe('demo', () => {
  // this you can put into support/index.ts file if you need it in every test file
  setupControlsExtensionWithEvent(mockButton(true, true));

  it('should show different message on clicking on mock-button', () => {
    const el = cypressAppSelect(`.turn-mock-on`);
    cy.log(
      el.attr('data-value') === 'checked'
        ? 'Running on **MOCK**'
        : 'Running on **SERVER**',
    );
  });
});
