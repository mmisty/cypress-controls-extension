export const cypressAppSelect = (selector: string) =>
  Cypress.$(selector, top?.document);

/**
 * Sets session storage
 * @param item
 * @param value
 */
export const setStoredVar = (item: string, value: string) =>
  window.sessionStorage.setItem(item, value);

/**
 * Get item from session storage
 * @param item
 * @param defaultValue when no such value in storage
 */
export const getStoredVar = <T>(item: string, defaultValue: T): T => {
  const storage = window.sessionStorage.getItem(item);

  if (storage == null) {
    const envVar =
      Cypress.env(item) !== undefined ? Cypress.env(item) : defaultValue;

    setStoredVar(item, typeof defaultValue ==='string' ? envVar : JSON.stringify(envVar));
  }

  return typeof defaultValue ==='string' ?
    window.sessionStorage.getItem(item) ?? '' :  JSON.parse(window.sessionStorage.getItem(item) ?? '');
};

export const updateEnvVar = <T>(item: string, defaultValue: T) =>
  Cypress.env(item, getStoredVar(item, defaultValue));
