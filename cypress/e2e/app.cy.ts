
describe('App', function () {
  it('test', function () {
    if(Cypress.env('MOCK')){
      cy.log('MOCKed')
    }
    else{
      cy.log('server')
    }
    if(Cypress.env('OTHER')){
      cy.log('OTHE')
    }
    else{
      cy.log('non-nother')
    }
  });

});
