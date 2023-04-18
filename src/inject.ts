import { ModeSetting, SetupControlSettings } from './control-settings.types';
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

const isMode = (openRun: 'open' | 'run', setting?: ModeSetting) => {
  if (!setting && openRun === 'run') {
    // no setting and run mode - not inject
    return false;
  }

  if (!setting && openRun === 'open') {
    // no setting and open mode - inject
    return true;
  }

  if (!setting) {
    return false;
  }

  if (openRun === 'open' && setting.open === undefined) {
    return false;
  }

  if (openRun === 'run' && setting.run === undefined) {
    return false;
  }

  return setting[openRun];
};

const addControlWhenNotExist = (
  atPosition: 'start' | 'end' | 'insertAfter' | 'insertBefore',
  wrapperId: string,
  toInject: JQuery,
  html: string,
) => {
  // When already exist on page
  if (
    toInject.find(`#${wrapperId}`).length > 0 ||
    cypressAppSelect('body').find(`#${wrapperId}`).length > 0
  ) {
    return;
  }
  console.log(message('Injecting: ' + wrapperId));

  if (atPosition === 'start') {
    toInject.prepend(html);
  } else if (atPosition === 'insertAfter') {
    Cypress.$(html).insertAfter(toInject);
  } else if (atPosition === 'insertBefore') {
    Cypress.$(html).insertBefore(toInject);
  } else {
    toInject.append(html);
  }
};

/**
 * Injects controls to page and returns parent id of created element
 * @param settings
 */
export const injectControl = (
  settings: SetupControlSettings,
): string | undefined => {
  const cypressInteractive = Cypress.config('isInteractive');
  const isOpen = isMode('open', settings.mode);
  const isRun = isMode('run', settings.mode);

  if ((cypressInteractive && !isOpen) || (!cypressInteractive && !isRun)) {
    // do not add according to config modes
    console.info(
      message('Will not inject control: ' + JSON.stringify(settings.mode)),
    );
    return undefined;
  }

  const wrapperId = wrapperIdFromSettings(settings.id);
  const control = `<span id="${wrapperId}" class="control-wrapper">${settings.control()}</span>`;
  const controls = cypressAppSelect(
    settings?.selectorToInject ?? '.reporter header',
  );

  addControlWhenNotExist(
    settings.inject ?? 'end',
    wrapperId,
    controls,
    control,
  );

  if (settings.style) {
    setStyle(wrapperId, settings.style(wrapperId));
  }

  settings.addEventListener(
    wrapperId,
    (selector, event, handler) => {
      const element = cypressAppSelect(selector);
      if (element?.length === 0) {
        console.warn(
          message(
            `could not set event listener: no matching elements for "${selector}"`,
          ),
        );
        return;
      }

      element.get().forEach((item) => {
        item.addEventListener(event, (target) => {
          handler(target);

          if (settings.style) {
            setStyle(wrapperId, settings.style(wrapperId));
          }
        });
      });
    },

    cyStopClick,
    cyRestartClick,
  );

  return wrapperId;
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
