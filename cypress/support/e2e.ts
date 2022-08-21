if (Cypress.env('COVERAGE') === true) {
  console.log('ENABLE COV');
  require('@cypress/code-coverage/support');
}
