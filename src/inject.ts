import { SetupControlSettings } from './control-settings';
import { cypressAppSelect } from './common';
import { setStyle } from './style-handler';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appId = require('../package.json').name;
const message = (msg: string) => `${appId}: ${msg}`;

const cyStopClick = () => cypressAppSelect('.stop').trigger('click');
const cyRestartClick = () => cypressAppSelect('.restart').trigger('click');

export const injectControl = (settings: SetupControlSettings) => {
  const cypressInteractive = Cypress.config('isInteractive');

  if (
    (!settings.mode.open && cypressInteractive) ||
    (!settings.mode.run && !cypressInteractive)
  ) {
    // do not add according to config modes
    return;
  }

  const wrapperId = `controlWrapper-${settings.id}`;
  const control = `<span id="${wrapperId}" class="control-wrapper">${settings.control()}</span>`;
  const controls = cypressAppSelect('.reporter header');

  if (controls.find(`#${wrapperId}`).length === 0) {
    controls.append(control);
  }

  if (settings.style) {
    setStyle(wrapperId, settings.style(wrapperId));
  }

  settings.addEventListener(
    (selector, event, handler) => {
      if (cypressAppSelect(selector)?.get()?.[0]) {
        cypressAppSelect(selector)
          .get()[0]
          .addEventListener(event, () => {
            handler();
          });
      } else {
        console.warn(message('Could not set event listener'));
      }
    },
    () => cyStopClick(),
    () => cyRestartClick(),
  );
};

const injectControls = (controlSettings: SetupControlSettings[]) => {
  const ids = controlSettings.map((s) => s.id);
  if (controlSettings.some((s) => ids.filter((c) => s.id === c).length > 1)) {
    throw new Error(
      message(`Controls should have uniq ids: ${JSON.stringify(ids)}`),
    );
  }

  controlSettings.forEach((setting) => {
    injectControl(setting);
  });
};

/**
 * Injects controls and adds event listeners on action
 * Cypress.on('test:before:run:async'
 * @param controlSettings array of injected controls
 */
export const setupControlsExtensionWithEvent = (
  controlSettings: SetupControlSettings[],
) => {
  Cypress.on('test:before:run:async', () => {
    injectControls(controlSettings);
  });
};

/**
 * Injects controls and adds event listeners
 * @param controlSettings array of injected controls
 */
export const setupControlsExtension = (
  controlSettings: SetupControlSettings[],
) => {
  injectControls(controlSettings);
};
