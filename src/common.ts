/**
 * Cypress 15.19+ mounts the command log in a same-origin `#reporter-frame`
 * iframe so reporter layout is isolated from the AUT document. Query that
 * document when present; otherwise fall back to the top document (15.10–15.18).
 */
const getCypressAppDocument = (): Document | undefined => {
  const topDocument = top?.document;
  const reporterFrame = topDocument?.getElementById('reporter-frame') as
    | HTMLIFrameElement
    | null
    | undefined;

  return (
    reporterFrame?.contentDocument ??
    reporterFrame?.contentWindow?.document ??
    topDocument
  );
};

export const cypressAppSelect = (selector: string) =>
  Cypress.$(selector, getCypressAppDocument());

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
    const exposed = Cypress.expose(item as never);
    const envVar = exposed !== undefined ? exposed : defaultValue;

    if (envVar === undefined) {
      return undefined;
    }

    setStoredVar(item, isString ? envVar : JSON.stringify(envVar));
  }

  const value = window.sessionStorage.getItem(item) as string;

  return (isString ? value : JSON.parse(value)) as T;
};

export const updateEnvVar = <T>(item: string, defaultValue: T) =>
  Cypress.expose(item as never, getStoredVar(item, defaultValue) as never);
