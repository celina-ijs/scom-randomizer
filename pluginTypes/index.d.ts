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
    import { Module, ControlElement, Container } from "@ijstech/components";
    import { IConfig, PageBlock } from "@scom/scom-randomizer/global/index.ts";
    import "@scom/scom-randomizer/index.css.ts";
    interface ScomRandomizerElement extends ControlElement {
        releaseUTCTime?: string;
        numberOfValues?: number;
        from?: number;
        to?: number;
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
        private timer;
        private oldTag;
        tag: any;
        init(): Promise<void>;
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
        getData(): Promise<IConfig>;
        setData(value: IConfig): Promise<void>;
        refreshApp(): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        private updateStyle;
        private updateTheme;
        getEmbedderActions(): ({
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => Promise<void>;
                redo: () => void;
            };
            userInputDataSchema: {
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
                    backgroundColor?: undefined;
                    fontColor?: undefined;
                    winningNumberBackgroundColor?: undefined;
                    winningNumberFontColor?: undefined;
                    roundNumberFontColor?: undefined;
                    nextDrawFontColor?: undefined;
                };
            };
        } | {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: {
                type: string;
                properties: {
                    backgroundColor: {
                        type: string;
                        format: string;
                    };
                    fontColor: {
                        type: string;
                        format: string;
                    };
                    winningNumberBackgroundColor: {
                        type: string;
                        format: string;
                    };
                    winningNumberFontColor: {
                        type: string;
                        format: string;
                    };
                    roundNumberFontColor: {
                        type: string;
                        format: string;
                    };
                    nextDrawFontColor: {
                        type: string;
                        format: string;
                    };
                    releaseUTCTime?: undefined;
                    numberOfValues?: undefined;
                    from?: undefined;
                    to?: undefined;
                };
            };
        })[];
        getActions(): ({
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => Promise<void>;
                redo: () => void;
            };
            userInputDataSchema: {
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
                    backgroundColor?: undefined;
                    fontColor?: undefined;
                    winningNumberBackgroundColor?: undefined;
                    winningNumberFontColor?: undefined;
                    roundNumberFontColor?: undefined;
                    nextDrawFontColor?: undefined;
                };
            };
        } | {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => Promise<void>;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: {
                type: string;
                properties: {
                    backgroundColor: {
                        type: string;
                        format: string;
                    };
                    fontColor: {
                        type: string;
                        format: string;
                    };
                    winningNumberBackgroundColor: {
                        type: string;
                        format: string;
                    };
                    winningNumberFontColor: {
                        type: string;
                        format: string;
                    };
                    roundNumberFontColor: {
                        type: string;
                        format: string;
                    };
                    nextDrawFontColor: {
                        type: string;
                        format: string;
                    };
                    releaseUTCTime?: undefined;
                    numberOfValues?: undefined;
                    from?: undefined;
                    to?: undefined;
                };
            };
        })[];
        render(): any;
    }
}
