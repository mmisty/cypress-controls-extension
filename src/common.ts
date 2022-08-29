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
export const getStoredVar = <T>(
  item: string,
  defaultValue?: T,
): T | undefined => {
  const storage = window.sessionStorage.getItem(item);
  const isString = typeof defaultValue === 'string';

  if (storage == null) {
    const envVar =
      Cypress.env(item) !== undefined ? Cypress.env(item) : defaultValue;

    if (envVar === undefined) {
      return undefined;
    }

    setStoredVar(item, isString ? envVar : JSON.stringify(envVar));
  }

  const value = window.sessionStorage.getItem(item) as string;

  return isString ? value : JSON.parse(value);
};

export const updateEnvVar = <T>(item: string, defaultValue: T) =>
  Cypress.env(item, getStoredVar(item, defaultValue));
