export type ModeSetting = {
  open?: boolean;
  run?: boolean;
};

export type ListenerSetting = (
  selector: string,
  event: string,
  handler: (target: Event) => void,
) => void;

export type FnVoid = () => void;

export type SetupControlSettings = {
  /**
   * Whether to add control for mode
   * default: true for both
   */
  mode?: ModeSetting;

  /**
   * Uniq ID to html element when several elements added
   */
  id: string;

  /**
   * Selector which will be injected
   */
  selectorToInject?: string;

  /**
   * HTML for injected control
   */
  control: () => string;

  /**
   * css for controls
   * @param parentId wrapper html id for injected control
   */
  style?: (parentId: string) => string;

  /**
   * event listener
   * @example
   *
   */
  addEventListener: (
    parentId: string,
    listener: ListenerSetting,
    cyStop: FnVoid,
    cyRestart: FnVoid,
  ) => void;
};
