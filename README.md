# cypress-controls-ext

Extension to embed controls to controls panel in cypress app

Can have event listeners and custom style

![alt preview](https://github.com/mmisty/cypress-controls-extension/blob/main/docs/preview.gif)


## Setup
**Prerequisites**: 
 - cypress installed in project

**Steps**:
1. install package

    ```
    npm i --save-dev cypress-controls-ext
    ```
    or
    
    ```
   yarn add -D cypress-controls-ext
   ```

2. create control - object of type SetupControlSettings
    
   ```typescript
   // simple example, you can put that into separate file
   export const myControl: SetupControlSettings = {
      // uniq id to html element
      id: 'my-button',
   
      // in what modes to inject control
      mode: {
        run: false,
        open: true,
      },
   
      // html for your control
      control: () => `<button id="myBut">Button</button>`,

      // event listener for control
      // add correct selector (with parentId)
      addEventListener: (parentId: string, listener: ListenerSetting) => {
        listener('#' + parentId + ' #myBut', 'click', () => {
          // will log message on #myBut click
          Cypress.log({ name: 'CLICK', message: '#myBut' });
        });
      },
      // also optional style handler could be added here
    };
   ```
   
3. register control before tests
    
    You can do that 
    - by `setupControlsExtensionWithEvent(myControl);` in support/index.js file : constrol will be `Cypress.on('test:before:run:async'...`
    - by `setupControlsExtension(myControl)`  - this doesn't use event

## Features
 - You can add several controls
 - You can add style handler
   ```typescript
     ...
       mode: { run: true, open: true },
       id: 'myButton',
       style: (parentId: string) => &grave;
         #${parentId} {
           background-color: '#569532'};
         }

         #${parentId} .turn-mock-on-label {
           padding: 5px;
           color: red;
           font-weight: bold;
         }
       &grave;,
   ...
   ```

## Examples
 - Check out [mock-button](https://github.com/mmisty/cypress-controls-extension/blob/main/cypress/controls/mock-button.ts) control
 - Cypress test for using mock-button: [demo.cy.ts](https://github.com/mmisty/cypress-controls-extension/blob/main/cypress/e2e/demo.cy.ts)

## Todo
 - predefined controls (checkbox, dropdown)
