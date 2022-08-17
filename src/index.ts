export type SetupControlSettings = {
  /**
   * Whether to add control for mode
   */
  mode: {
    open: boolean;
    run: boolean;
  };
  /**
   * Uniq ID to html element when several elements added
   */
  id: string;
  /**
   * HTML for injected control
   */
  control: () => string;
  // todo
  // style: () => void,
  // styleHandler: () => void,
  addEventListener: (
    listener: (selector: string, event: string, handler: () => void) => void,
    cyStop: () => void,
    cyRestart: () => void,
  ) => void;
};

export const injectControl = (settings: SetupControlSettings) => {
  const cypressInteractive = Cypress.config('isInteractive');

  if (
    (!settings.mode.open && cypressInteractive) ||
    (!settings.mode.run && !cypressInteractive)
  ) {
    // do not add according to config nodes
    return;
  }
  const cypressAppSelect = (selector: string) => cy.$$(selector, top?.document);
  const cyStopClick = () => cypressAppSelect('.stop').trigger('click');
  const cyRestartClick = () => cypressAppSelect('.restart').trigger('click');

  const control = `<span id="controlWrapper-${
    settings.id
  }" style="padding: 5px;padding-top:13px;">
        ${settings.control()}
     </span>`;

  const controls = cypressAppSelect('.reporter header');

  if (controls.find(`#controlWrapper-${settings.id}`).length === 0) {
    // adding control
    controls.append(control);
  }

  // todo style

  settings.addEventListener(
    (selector, event, handler) => {
      cypressAppSelect(selector)
        .get()[0]
        .addEventListener(event, () => {
          handler();
        });
    },
    () => cyStopClick(),
    () => cyRestartClick(),
  );
};

export const setupControlsExtensionWithEvent = (
  controlSettings: SetupControlSettings[],
) => {
  Cypress.on('test:before:run:async', () => {
    console.log('test:before:run:async');

    controlSettings.forEach((setting) => {
      injectControl(setting);
    });
  });
};

// need to call inside Cypress.on('test:before:run:async'
export const setupControlsExtension = (
  controlSettings: SetupControlSettings[],
) => {
  controlSettings.forEach((setting) => {
    injectControl(setting);
  });
};
