/// <amd-module name="@scom/scom-randomizer/interface.ts" />
declare module "@scom/scom-randomizer/interface.ts" {
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
/// <amd-module name="@scom/scom-randomizer/data.json.ts" />
declare module "@scom/scom-randomizer/data.json.ts" {
    const _default: {
        defaultBuilderData: {
            numberOfValues: number;
            from: number;
            to: number;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-randomizer/formSchema.json.ts" />
declare module "@scom/scom-randomizer/formSchema.json.ts" {
    const _default_1: {
        dataSchema: {
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
                dark: {
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
                    };
                };
                light: {
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
                    };
                };
            };
        };
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        scope: string;
                    }[];
                }[];
            } | {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        label: string;
                        scope: string;
                    }[];
                }[];
            })[];
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-randomizer" />
declare module "@scom/scom-randomizer" {
    import { Module, ControlElement, Container } from "@ijstech/components";
    import { IConfig } from "@scom/scom-randomizer/interface.ts";
    import "@scom/scom-randomizer/index.css.ts";
    interface ScomRandomizerElement extends ControlElement {
        lazyLoad?: boolean;
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
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: () => {
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
                        dark: {
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
                            };
                        };
                        light: {
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
                            };
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    } | {
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                label: string;
                                scope: string;
                            }[];
                        }[];
                    })[];
                };
            }[];
            getData: any;
            setData: (data: IConfig) => Promise<void>;
            setTag: any;
            getTag: any;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
        } | {
            name: string;
            target: string;
            getActions: () => {
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
                        dark: {
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
                            };
                        };
                        light: {
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
                            };
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    } | {
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                label: string;
                                scope: string;
                            }[];
                        }[];
                    })[];
                };
            }[];
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            getData: any;
            setData: any;
            setTag: any;
            getTag: any;
        })[];
        private _getActions;
        render(): any;
    }
}
