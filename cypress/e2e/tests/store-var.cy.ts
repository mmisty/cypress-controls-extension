import { getStoredVar } from 'cy-ext';

describe('store var', () => {
  beforeEach(() => {
    cy.window().then((w) => w.window.sessionStorage.clear());
  });
  it('should test string default', () => {
    const myBar = getStoredVar('MINE', 'hello');
    expect(myBar).to.eq('hello');
  });

  it('should test string default undefined', () => {
    const myBar = getStoredVar('MINE', undefined);
    expect(myBar).to.eq(undefined);
  });

  it('should test string', () => {
    getStoredVar('MINE', 'hello');
    const myBar1 = getStoredVar('MINE', 'buy');
    expect(myBar1).to.eq('hello');
  });

  it('should test Cypress env', () => {
    Cypress.env('MINE', 'FROM CYPRESS hello');
    const myBar1 = getStoredVar('MINE', 'hello');
    expect(myBar1).to.eq('FROM CYPRESS hello');
  });

  it('should test string Cypress env undefined', () => {
    Cypress.env('MINE', undefined);
    const myBar1 = getStoredVar('MINE', 'hello');
    expect(myBar1).to.eq('hello');
  });

  it('should test number default', () => {
    const myBar = getStoredVar('MINE_NUM', 1);
    expect(myBar).to.eq(1);
  });

  it('should test number default with env', () => {
    Cypress.env('MINE_NUM', 2);
    const myBar = getStoredVar('MINE_NUM', 1);
    expect(myBar).to.eq(2);
  });
});
