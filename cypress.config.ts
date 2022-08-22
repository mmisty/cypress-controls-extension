import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      if (config.env['COVERAGE'] === true) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('@cypress/code-coverage/task')(on, config);
      }

      console.log('CYPRESS ENV:');
      console.log(config.env);

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config;
    },

    video: false,
  },
});
