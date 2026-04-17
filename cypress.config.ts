import { defineConfig } from 'cypress';

const COVERAGE = 'COVERAGE';

const isCoverage = (config: Cypress.PluginConfigOptions) =>
  process.env.CYPRESS_COVERAGE === 'true' ||
  process.env[COVERAGE] === 'true' ||
  config.expose[COVERAGE] === true;

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    expose: {},
    reporter: 'junit',
    reporterOptions: {
      mochaFile: './reports/cypress/[hash].xml',
      toConsole: false,
    },

    setupNodeEvents(on, config) {
      if (isCoverage(config)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('@cypress/code-coverage/task')(on, config);
        config.expose[COVERAGE] = true;
      }

      console.log('CYPRESS Expose:');
      console.log(config.expose);

      return config;
    },

    video: false,
  },
});
