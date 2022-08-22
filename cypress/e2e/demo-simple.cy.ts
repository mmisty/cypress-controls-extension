import { ListenerSetting, setupControlsExtension } from 'cy-ext';

describe('suite', () => {
  it('should test', () => {
    const control = {
      id: 'my-button',
      mode: {
        run: false,
        open: true,
      },

      control: () => `<button id="myBut">Button</button>`,

      addEventListener: (_parentId: string, listener: ListenerSetting) => {
        listener('#myBut', 'click', () => {
          Cypress.log({ name: 'CLICK', message: '#myBut' });
        });
      },
    };

    setupControlsExtension(control);
  });
});
