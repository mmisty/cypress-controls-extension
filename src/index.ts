
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
  /**
   * css for controls
   */
   style: (parentId: string) => string,
  
  /**
   * event listener
   */
  addEventListener: (
    listener: (selector: string, event: string, handler: () => void) => void,
    cyStop: () => void,
    cyRestart: () => void,
  ) => void;
};

const cypressAppSelect = (selector: string) => cy.$$(selector, top?.document);
const cyStopClick = () => cypressAppSelect('.stop').trigger('click');
const cyRestartClick = () => cypressAppSelect('.restart').trigger('click');

const setStyle = (wrapperId:string, styleDef:string) => {
  const startLine = `/* cypress controls extension ${wrapperId}*/`;
  const endLine = `/* cypress controls extension end ${wrapperId}*/`;
  
  // add style tag if no
  if(cypressAppSelect('html head style').length === -1 ) {
    cypressAppSelect('html head').append(`<style type="text/css">
        ${startLine}
        ${endLine}
        </style>`);
  }
  
  const wrapperStyleCss = styleDef;
  
  const style = cypressAppSelect('html head style');
  const html = style.html();
  // add style first time for session
  if(html.indexOf(startLine) === -1){
    style.append(`
         ${startLine}
         ${wrapperStyleCss}
         ${endLine}
         `)
  } else {
    // change style
    const start = html.indexOf(startLine);
    const end = html.indexOf(endLine + endLine.length);
    
    const toReplace = html.slice(start, end);
    
    if(style.get()?.[0]){
      style.get()[0].innerHTML = html.replace(toReplace, wrapperStyleCss)
    }
  }
};

export const injectControl = (settings: SetupControlSettings) => {
  console.log('INJECT --' + settings.id)
  const cypressInteractive = Cypress.config('isInteractive');
  
  if (
    (!settings.mode.open && cypressInteractive) ||
    (!settings.mode.run && !cypressInteractive)
  ) {
    // do not add according to config nodes
    return;
  }
  
  const wrapperId = `controlWrapper-${settings.id}`;
  const control = `<span id="${wrapperId}" style="padding: 5px;padding-top:5px;">${settings.control()}</span>`;
  const controls = cypressAppSelect('.reporter header');
  
  if (controls.find(`#${wrapperId}`).length === 0) {
    controls.append(control);
  }
  
  setStyle(wrapperId, settings.style(wrapperId));

  settings.addEventListener(
    (selector, event, handler) => {
      if( cypressAppSelect(selector)?.get()?.[0]){
        cypressAppSelect(selector)
          .get()[0]
          .addEventListener(event, () => {
            handler();
          });
      }
      else {
        console.warn('cypress-controls-extension: Could not set event listner');
      }
    },
    () => cyStopClick(),
    () => cyRestartClick(),
  );
  
};

export const setupControlsExtensionWithEvent = (
  controlSettings: SetupControlSettings[],
) => {
  Cypress.on('test:before:run:async', () => {

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
