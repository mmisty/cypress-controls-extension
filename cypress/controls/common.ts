export const setStoredVar = (item: string, val: string) =>
  window.sessionStorage.setItem(item, val);

export const getStoredVar = <T>(item: string, defaultValue: T) => {
  const storage = window.sessionStorage.getItem(item);

  if (storage == null) {
    const envVar =
      Cypress.env(item) !== undefined ? Cypress.env(item) : defaultValue;
    setStoredVar(item, envVar);
  }

  return JSON.parse(window.sessionStorage.getItem(item) ?? '');
};

export const updateEnvVar = <T>(item: string, defaultValue: T) =>
  Cypress.env(item, getStoredVar(item, defaultValue));
