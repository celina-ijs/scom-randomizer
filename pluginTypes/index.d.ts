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
    import { Module, ControlElement, Container } from "@ijstech/components";
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
    export default class ScomRandomizer extends Module {
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
        private getData;
        private setData;
        private refreshApp;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        private getPropertiesSchema;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            getTag: any;
            setData: any;
        }[];
        private getEmbedderActions;
        private getActions;
        private _getActions;
        render(): any;
    }
}
