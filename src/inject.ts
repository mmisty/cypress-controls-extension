import { SetupControlSettings } from './control-settings.types';
import { cypressAppSelect } from './common';
import { setStyle } from './style-handler';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appId = 'cypress-controls-ext';
const message = (msg: string) => `${appId}: ${msg}`;

const cyStopClick: () => void = () => {
  cypressAppSelect('.stop').trigger('click');
};

const cyRestartClick: () => void = () => {
  cypressAppSelect('.restart').trigger('click');
};

const wrapperIdFromSettings = (id: string) => `controlWrapper-${id}`;

export const injectControl = (settings: SetupControlSettings) => {
  const cypressInteractive = Cypress.config('isInteractive');
  const isOpen =
    settings.mode && settings.mode.open === undefined
      ? false
      : settings.mode?.open === undefined
      ? true
      : settings.mode.open;

  const isRun =
    settings.mode && settings.mode.run === undefined
      ? false
      : settings.mode?.run === undefined
      ? true
      : settings.mode.run;

  if ((cypressInteractive && !isOpen) || (!cypressInteractive && !isRun)) {
    // do not add according to config modes
    return;
  }
  const wrapperId = wrapperIdFromSettings(settings.id);
  const control = `<span id="${wrapperId}" class="control-wrapper">${settings.control()}</span>`;
  const controls = cypressAppSelect(
    settings?.selectorToInject ?? '.reporter header',
  );

  if (controls.find(`#${wrapperId}`).length === 0) {
    controls.append(control);
  }

  if (settings.style) {
    setStyle(wrapperId, settings.style(wrapperId));
  }

  settings.addEventListener(
    wrapperId,
    (selector, event, handler) => {
      if (cypressAppSelect(selector)?.get()?.[0]) {
        cypressAppSelect(selector)
          .get()[0]
          .addEventListener(event, (target) => {
            handler(target);

            if (settings.style) {
              setStyle(wrapperId, settings.style(wrapperId));
            }
          });
      } else {
        console.warn(message('Could not set event listener'));
      }
    },
    cyStopClick,
    cyRestartClick,
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
 * Remove controls
 * @param controlSettings
 */
export const removeControls = (...controlSettings: SetupControlSettings[]) => {
  controlSettings.forEach((setting) => {
    cypressAppSelect('#' + wrapperIdFromSettings(setting.id)).remove();
  });
};

/**
 * Injects controls and adds event listeners on action
 * Cypress.on('test:before:run:async'
 * @param controlSettings array of injected controls
 */
export const setupControlsExtensionWithEvent = (
  ...controlSettings: SetupControlSettings[]
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
  ...controlSettings: SetupControlSettings[]
) => {
  injectControls(controlSettings);
};
