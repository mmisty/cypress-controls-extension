import {
  SetupControlSettings,
  setupControlsExtensionWithEvent,
} from '../../src';

const mockButton: SetupControlSettings = {
  mode: { run: true, open: true },
  id: 'myButton',
  control: () =>
    `<span id="turnMockOnLabel" style="padding:5px;">Mock:</span>
     <input id="turnMockOn" type="checkbox" ${
       !!Cypress.env('MOCK_SERVICES') ? 'checked' : ''
     }>`,

  addEventListener: (
    listener: (selector: string, event: string, handler: () => void) => void,
    cyStop,
    cyRestart,
  ) => {
    listener('#turnMockOn', 'click', () => {
      const oldValue = !!Cypress.env('MOCK_SERVICES');
      const newValue = !oldValue;
      Cypress.env('MOCK_SERVICES', newValue);

      cyStop();
      cyRestart();
    });
  },
};

setupControlsExtensionWithEvent([mockButton]);
