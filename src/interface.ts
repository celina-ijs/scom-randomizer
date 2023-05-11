export interface PageBlock {
  // Properties
  getData: () => any;
  setData: (data: any) => Promise<void>;
  getTag: () => any;
  setTag: (tag: any) => Promise<void>
  validate?: () => boolean;
  defaultEdit?: boolean;
  tag?: any;
}

export interface IConfig {
  round?: number;
  releaseTime?: string;
  releaseUTCTime?: string; //to be removed
  numberOfValues?: number;
  from?: number;
  to?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}
