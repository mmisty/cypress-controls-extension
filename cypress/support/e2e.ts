if (
  `${Cypress.expose('COVERAGE')}` === 'true' ||
  Cypress.expose('COVERAGE') === true
) {
  console.log('ENABLE COV');
  require('@cypress/code-coverage/support');
}
