
describe('App', function () {
  it('test', function () {
    if(Cypress.env('MOCK')){
      cy.log('MOCKED')
    }
    else{
      cy.log('server')
    }
    if(Cypress.env('OTHER')){
      cy.log('Setting ON')
    }
    else{
      cy.log('Setting OFF')
    }
  });

});
