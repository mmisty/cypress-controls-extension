export const cypressAppSelect = (selector: string) =>
  cy.$$(selector, top?.document);
