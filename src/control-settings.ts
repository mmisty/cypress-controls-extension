export type SetupControlSettings = {
  /**
   * Whether to add control for mode
   */
  mode: {
    open: boolean;
    run: boolean;
  };

  /**
   * Uniq ID to html element when several elements added
   */
  id: string;

  /**
   * HTML for injected control
   */
  control: () => string;

  /**
   * css for controls
   */
  style: (parentId: string) => string;

  /**
   * event listener
   */
  addEventListener: (
    listener: (selector: string, event: string, handler: () => void) => void,
    cyStop: () => void,
    cyRestart: () => void,
  ) => void;
};
