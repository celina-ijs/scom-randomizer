/// <amd-module name="@scom/scom-randomizer/global/index.ts" />
declare module "@scom/scom-randomizer/global/index.ts" {
    export interface PageBlock {
        getData: () => any;
        setData: (data: any) => Promise<void>;
        getTag: () => any;
        setTag: (tag: any) => Promise<void>;
        validate?: () => boolean;
        defaultEdit?: boolean;
        tag?: any;
    }
    export interface IConfig {
        round?: number;
        releaseTime?: string;
        releaseUTCTime?: string;
        numberOfValues?: number;
        from?: number;
        to?: number;
        showHeader?: boolean;
        showFooter?: boolean;
    }
}
/// <amd-module name="@scom/scom-randomizer/index.css.ts" />
declare module "@scom/scom-randomizer/index.css.ts" { }
/// <amd-module name="@scom/scom-randomizer/utils.ts" />
declare module "@scom/scom-randomizer/utils.ts" {
    function getRandomizerResult(round: number, numberOfValues: number, from: number, to: number): Promise<string[]>;
    function getRoundByReleaseTime(releaseTime: number): Promise<number>;
    export { getRandomizerResult, getRoundByReleaseTime };
}
/// <amd-module name="@scom/scom-randomizer" />
declare module "@scom/scom-randomizer" {
    import { Module, ControlElement, Container, IDataSchema } from "@ijstech/components";
    import { IConfig, PageBlock } from "@scom/scom-randomizer/global/index.ts";
    import "@scom/scom-randomizer/index.css.ts";
    interface ScomRandomizerElement extends ControlElement {
        releaseUTCTime?: string;
        numberOfValues?: number;
        from?: number;
        to?: number;
        showHeader?: boolean;
        showFooter?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-randomizer"]: ScomRandomizerElement;
            }
        }
    }
    export default class ScomRandomizer extends Module implements PageBlock {
        private _oldData;
        private _data;
        private lbRound;
        private lbDrawTime;
        private gridResults;
        private hstackReleaseTime;
        private hstackCountdown;
        private lbReleaseTime;
        private hstackResult;
        private lbReleasedDays;
        private lbReleasedHours;
        private lbReleasedMins;
        private dappContainer;
        private timer;
        private oldTag;
        tag: any;
        init(): Promise<void>;
        private initTag;
        static create(options?: ScomRandomizerElement, parent?: Container): Promise<ScomRandomizer>;
        private setReleaseTime;
        get releaseUTCTime(): string;
        set releaseUTCTime(value: string);
        get numberOfValues(): number;
        set numberOfValues(value: number);
        get from(): number;
        set from(value: number);
        get to(): number;
        set to(value: number);
        get showFooter(): boolean;
        set showFooter(value: boolean);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        getData(): Promise<IConfig>;
        setData(value: IConfig): Promise<void>;
        refreshApp(): Promise<void>;
        getTag(): any;
        private updateTag;
        setTag(value: any, init?: boolean): Promise<void>;
        private updateStyle;
        private updateTheme;
        getPropertiesSchema(): {
            type: string;
            properties: {
                releaseUTCTime: {
                    title: string;
                    type: string;
                    format: string;
                };
                numberOfValues: {
                    type: string;
                };
                from: {
                    type: string;
                };
                to: {
                    type: string;
                };
            };
        };
        getEmbedderActions(): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        getActions(): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        render(): any;
    }
}
