import {
  Module,
  customModule,
  customElements,
  Label,
  HStack,
  GridLayout,
  moment,
  Styles,
  ControlElement,
  Container,
  IDataSchema
} from "@ijstech/components";
import {} from '@ijstech/eth-contract'
import { IConfig } from "./global/index";
import './index.css';
import { getRoundByReleaseTime, getRandomizerResult } from "./utils";
import ScomDappContainer from "@scom/scom-dapp-container";

interface ScomRandomizerElement extends ControlElement {
  releaseUTCTime?: string;
  numberOfValues?: number;
  from?: number;
  to?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}
const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-randomizer"]: ScomRandomizerElement;
    }
  }
}

@customModule
@customElements('i-scom-randomizer')
export default class ScomRandomizer extends Module {
  private _oldData: IConfig = {};
  private _data: IConfig = {};
  private lbRound: Label;
  private lbDrawTime: Label;
  private gridResults: GridLayout;
  private hstackReleaseTime: HStack;
  private hstackCountdown: HStack;
  private lbReleaseTime: Label;
  private hstackResult: HStack;
  private lbReleasedDays: Label;
  private lbReleasedHours: Label;
  private lbReleasedMins: Label;
  private dappContainer: ScomDappContainer;
  private timer: any;
  private oldTag: any = {};
  tag: any = {};

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    this.initTag();
    this._data.releaseUTCTime = this.getAttribute('releaseUTCTime', true);
    this._data.numberOfValues = this.getAttribute('numberOfValues', true);
    this._data.from = this.getAttribute('from', true);
    this._data.to = this.getAttribute('to', true);
    this._data.showHeader = this.getAttribute('showHeader', true);
    this._data.showFooter = this.getAttribute('showFooter', true);
    this.setReleaseTime();
    if (!this._data.round && this._data.releaseTime) {
      this._data.round = await getRoundByReleaseTime(Number(this._data.releaseTime));
    }
    await this.refreshApp();
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
  }

  private initTag() {
    const getColors = (vars: any) => {
      return {
        "backgroundColor": vars.background.main,
        "fontColor": vars.text.primary,
        "winningNumberBackgroundColor": vars.colors.warning.main,
        "winningNumberFontColor": vars.colors.warning.contrastText,
        "roundNumberFontColor": vars.colors.primary.main,
        "nextDrawFontColor": vars.text.secondary
      }
    }
    const defaultTag = {
      dark: getColors(Styles.Theme.darkTheme),
      light: getColors(Styles.Theme.defaultTheme)
    }
    this.oldTag = {...defaultTag};
    this.setTag(defaultTag, true);
  }

  static async create(options?: ScomRandomizerElement, parent?: Container){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  private setReleaseTime() {
    const utcValue = moment.utc(this._data.releaseUTCTime).valueOf()
    this._data.releaseTime = isNaN(utcValue) ? '' : utcValue.toString();
  }

  get releaseUTCTime() {
    return this._data.releaseUTCTime;
  }

  set releaseUTCTime(value: string) {
    this._data.releaseUTCTime = value;
    this.setReleaseTime();
    if (!this._data.round && this._data.releaseTime) {
      getRoundByReleaseTime(Number(this._data.releaseTime)).then(round => {
        this._data.round = round;
        this.refreshApp();
      });
    }
  }

  get numberOfValues() {
    return this._data.numberOfValues;
  }

  set numberOfValues(value: number) {
    this._data.numberOfValues = value;
    this.refreshApp();
  }

  get from() {
    return this._data.from;
  }

  set from(value: number) {
    this._data.from = value;
    this.refreshApp();
  }

  get to() {
    return this._data.to;
  }

  set to(value: number) {
    this._data.to = value;
    this.refreshApp();
  }

  get showFooter() {
    return this._data.showFooter ?? true
  }
  set showFooter(value: boolean) {
    this._data.showFooter = value
    if (this.dappContainer) this.dappContainer.showFooter = this.showFooter;
  }

  get showHeader() {
    return this._data.showHeader ?? true
  }
  set showHeader(value: boolean) {
    this._data.showHeader = value
    if (this.dappContainer) this.dappContainer.showHeader = this.showHeader;
  }

  private async getData() {
    return this._data;
  }

  private async setData(value: IConfig) {
    this._data = value;
    if (this._data.releaseTime) {
      this._data.releaseUTCTime = moment(Number(this._data.releaseTime)).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
    }
    if (!this._data.round && this._data.releaseTime) {
      this._data.round = await getRoundByReleaseTime(Number(this._data.releaseTime));
    }
    await this.refreshApp();
  }

  private async refreshApp() {
    const data: any = {
      showWalletNetwork: false,
      showHeader: this._data.showHeader ?? true,
      showFooter: this._data.showFooter ?? true
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data)
    if (!this.lbRound.isConnected) await this.lbRound.ready();
    this.lbRound.caption = this._data.round?.toString() || '';
    if (!this.lbDrawTime.isConnected) await this.lbDrawTime.ready();
    this.lbDrawTime.caption = this._data.releaseTime ?
      moment.utc(Number(this._data.releaseTime)).format('MMM DD, YYYY [at] HH:mm [UTC]') : '';
    this.gridResults.clearInnerHTML();
    if (this._data.releaseTime && Number(this._data.releaseTime) > new Date().getTime()) {
      this.hstackResult.visible = false;
      this.lbRound.font={size: '2rem', weight: 500, color: Theme.colors.primary.main};
      this.lbRound.lineHeight = '2.637rem';
      this.lbDrawTime.font={size: '1.75rem', weight: 500, color: Theme.text.secondary};
      this.lbDrawTime.lineHeight = '2.637rem';
      // this.hstackReleaseTime.visible = true;
      this.hstackCountdown.visible = true;
      if (!this.lbReleaseTime.isConnected) await this.lbReleaseTime.ready();
      this.lbReleaseTime.caption = moment(Number(this._data.releaseTime)).format('YYYY-MM-DD HH:mm');
      if (this.timer) {
        clearInterval(this.timer);
      }
      const refreshCountdown = async () => {
        const days = moment(Number(this._data.releaseTime)).diff(moment(), 'days');
        const hours = moment(Number(this._data.releaseTime)).diff(moment(), 'hours') - days * 24;
        const mins = moment(Number(this._data.releaseTime)).diff(moment(), 'minutes') - days * 24 * 60 - hours * 60;
        if (!this.lbReleasedDays.isConnected) await this.lbReleasedDays.ready();
        if (!this.lbReleasedHours.isConnected) await this.lbReleasedHours.ready();
        if (!this.lbReleasedMins.isConnected) await this.lbReleasedMins.ready();
        this.lbReleasedDays.caption = days.toString();
        this.lbReleasedHours.caption = hours.toString();
        this.lbReleasedMins.caption = mins.toString();
      }
      refreshCountdown();
      this.timer = setInterval(refreshCountdown, 60000);
    }
    else {
      this.hstackResult.visible = true;
      this.hstackReleaseTime.visible = false;
      this.hstackCountdown.visible = false;
      this.lbRound.font={size: '1.5rem', weight: 500, color: Theme.colors.primary.main};
      this.lbRound.lineHeight = '1.758rem';
      this.lbDrawTime.font={size: '1.5rem', weight: 500, color: Theme.colors.primary.main};
      this.lbDrawTime.lineHeight = '1.758rem';
      if (this._data.round && this._data.numberOfValues) {
        const result = await getRandomizerResult(this._data.round, this._data.numberOfValues, this._data.from, this._data.to);
        this.gridResults.clearInnerHTML();
        for (let value of result) {
          let label = await Label.create({
            class: 'random-number',
            display: 'inline-flex',
            font: { size: '2rem', bold: true, color: Theme.colors.warning.contrastText },
            border: {radius: '5px'},
            background: {color: Theme.colors.warning.main},
            width: 54.8,
            height: 54.8,
            caption: value
          })
          this.gridResults.append(label)
        }
        }
    }
  }

  private getTag() {
    return this.tag;
  }

  private updateTag(type: 'light'|'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.tag[type][prop] = value[prop];
    }
  }

  private async setTag(value: any, init?: boolean) {
    const newValue = value || {};
    if (newValue.light) this.updateTag('light', newValue.light);
    if (newValue.dark) this.updateTag('dark', newValue.dark);
    if (this.dappContainer && !init) this.dappContainer.setTag(this.tag);
    this.updateTheme();
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this.dappContainer?.theme || 'light';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--colors-primary-main', this.tag[themeVar]?.roundNumberFontColor);
    this.updateStyle('--colors-warning-contrast_text', this.tag[themeVar]?.winningNumberFontColor);
    this.updateStyle('--colors-warning-main', this.tag[themeVar]?.winningNumberBackgroundColor);
    this.updateStyle('--text-secondary', this.tag[themeVar]?.nextDrawFontColor);
  }

  private getPropertiesSchema() {
    return {
      type: 'object',
      properties: {
        "releaseUTCTime": {
          title: "Release UTC Time",
          type: "string",
          format: "date-time"
        },             
        // "releaseTime": {
        //   type: "string",
        //   format: "date-time"
        // },
        "numberOfValues": {
          type: 'number'
        },
        "from": {
          type: 'number'
        },
        "to": {
          type: 'number'
        }
      }
    }
  }

  getConfigurators() {
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: this.getActions.bind(this),
        getData: this.getData.bind(this),
        getTag: this.getTag.bind(this),
        setData: this.setData.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getActions: this.getEmbedderActions.bind(this),
        getData: this.getData.bind(this),
        getTag: this.getTag.bind(this),
        setData: this.setData.bind(this)
      }
    ]
  }

  private getEmbedderActions() {
    const propertiesSchema = this.getPropertiesSchema() as IDataSchema;
    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        dark: {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            fontColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            winningNumberBackgroundColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            winningNumberFontColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            roundNumberFontColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            nextDrawFontColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            }
          }
        },
        light: {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            fontColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            winningNumberBackgroundColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            winningNumberFontColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            roundNumberFontColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            },
            nextDrawFontColor: {
              type: 'string',
              format: 'color',
              readOnly: true
            }
          }
        }
      }
    }
    return this._getActions(propertiesSchema, themeSchema);
  }
  
  private getActions() {
    const propertiesSchema = this.getPropertiesSchema() as IDataSchema;
    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        dark: {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color'
            },
            fontColor: {
              type: 'string',
              format: 'color'
            },
            winningNumberBackgroundColor: {
              type: 'string',
              format: 'color'
            },
            winningNumberFontColor: {
              type: 'string',
              format: 'color'
            },
            roundNumberFontColor: {
              type: 'string',
              format: 'color'
            },
            nextDrawFontColor: {
              type: 'string',
              format: 'color'
            }
          }
        },
        light: {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color'
            },
            fontColor: {
              type: 'string',
              format: 'color'
            },
            winningNumberBackgroundColor: {
              type: 'string',
              format: 'color'
            },
            winningNumberFontColor: {
              type: 'string',
              format: 'color'
            },
            roundNumberFontColor: {
              type: 'string',
              format: 'color'
            },
            nextDrawFontColor: {
              type: 'string',
              format: 'color'
            }
          }
        }
      }
    }
    return this._getActions(propertiesSchema, themeSchema);
  }

  private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
    const actions = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          return {
            execute: async () => {
              this._oldData = {...this._data};
              if (userInputData.releaseUTCTime !== undefined) {
                this._data.releaseUTCTime = userInputData.releaseUTCTime;
                this.setReleaseTime();
              }
              if (userInputData.releaseTime != undefined) {
                this._data.releaseTime = userInputData.releaseTime;
                this._data.releaseUTCTime = moment(Number(this._data.releaseTime)).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
              }
              if (userInputData.numberOfValues != undefined) this._data.numberOfValues = userInputData.numberOfValues;
              if (userInputData.from != undefined) this._data.from = userInputData.from;
              if (userInputData.to != undefined) this._data.to = userInputData.to;
              this._data.round = this._data.releaseTime ? await getRoundByReleaseTime(Number(this._data.releaseTime)) : 0;
              await this.refreshApp();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: async () => {
              this._data = {...this._oldData};
              this._data.round = this._data.releaseTime ? await getRoundByReleaseTime(Number(this._data.releaseTime)) : 0;
              await this.refreshApp();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => {}
          }
        },
        userInputDataSchema: propertiesSchema
      },
      {
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          return {
            execute: async () => {
              if (!userInputData) return;
              this.oldTag = {...this.tag};
              if (builder) builder.setTag(userInputData);
              else this.setTag(userInputData);
              if (this.dappContainer) this.dappContainer.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = {...this.oldTag};
              if (builder) builder.setTag(this.tag);
              else this.setTag(this.tag);
              if (this.dappContainer) this.dappContainer.setTag(this.tag);
            },
            redo: () => {}
          }
        },
        userInputDataSchema: themeSchema
      }
    ]
    return actions;
  }

  render() {
    const paddingTimeUnit = { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem'};
    return (
      <i-scom-dapp-container id="dappContainer">
        <i-vstack
          id="pnlRandomizerMain"
          background={{color: Theme.background.main}}
          padding={{ top: '1.5rem', bottom: '4.75rem', left: '1rem', right: '1rem'}}
        >
          <i-hstack gap='0.25rem' visible={false} id="hstackReleaseTime">
            <i-label caption="Result will be released on " font={{ size: '1.2rem'}}></i-label>
            <i-label id="lbReleaseTime" font={{ size: '1.2rem', weight: 'bold'}}></i-label>
          </i-hstack>
          <i-stack
            direction="horizontal"
            gap="2.5rem"
          >
            <i-vstack gap='0.25rem'>
              <i-label caption="Draw Time:" font={{size: '1rem', weight: 500}} opacity={0.5} class="no-wrap"></i-label>
              <i-label id="lbDrawTime" font={{size: '1.5rem', weight: 500, color: Theme.text.secondary}}></i-label>
            </i-vstack>           
            <i-hstack gap='0.25rem' visible={false} id="hstackCountdown">
              <i-vstack>
                <i-label caption="Time until result:" font={{size: '1rem', weight: 500}} opacity={0.5} class="no-wrap"/>
                <i-hstack margin={{ top: 4 }} gap='0.5rem' verticalAlignment="center">
                  <i-label
                    id="lbReleasedDays"
                    border={{radius: '5px'}}
                    padding={paddingTimeUnit}
                    background={{color: Theme.colors.warning.main}}
                    font={{ size: '1.5rem', bold: true, color: Theme.colors.warning.contrastText }}
                    width={38}
                    height={38}
                    class='random-number'
                    display='inline-flex'
                  ></i-label>
                  <i-label caption="D" font={{ size: '1.2rem', weight: 'bold'}}/>
                  <i-label
                    id="lbReleasedHours"
                    border={{radius: '5px'}}
                    padding={paddingTimeUnit}
                    background={{color: Theme.colors.warning.main}}
                    font={{ size: '1.5rem', bold: true, color: Theme.colors.warning.contrastText }}
                    width={38}
                    height={38}
                    class='random-number'
                    display='inline-flex'
                  ></i-label>
                  <i-label caption="H" font={{ size: '1.2rem', weight: 'bold'}}/>
                  <i-label
                    id="lbReleasedMins"
                    border={{radius: '5px'}}
                    padding={paddingTimeUnit}
                    background={{color: Theme.colors.warning.main}}
                    font={{ size: '1.5rem', bold: true, color: Theme.colors.warning.contrastText }}
                    width={38}
                    height={38}
                    class='random-number'
                    display='inline-flex'
                  ></i-label>
                  <i-label caption="M" font={{ size: '1.2rem', weight: 'bold'}}/>
                </i-hstack>
              </i-vstack>
            </i-hstack>
            <i-vstack gap='0.25rem'>
              <i-label caption="Reference Round Number:" font={{size: '1rem', weight: 500}} opacity={0.5} class="no-wrap"></i-label>
              <i-label id="lbRound" font={{size: '1.5rem', weight: 500, color: Theme.colors.primary.main}}></i-label>
            </i-vstack>
          </i-stack>
          <i-hstack
            gap='0.75rem'
            visible={false}
            id="hstackResult"
            margin={{top: '2.5rem'}}
            verticalAlignment="center"
          >
            <i-label caption="Winning Number:" font={{size: '1rem', weight: 500}} opacity={0.5} class="no-wrap"></i-label>
            <i-grid-layout id={"gridResults"}
              gap={{ row: '0.688rem', column: '0.688rem' }}
              templateColumns={['repeat(auto-fill, 54.8px)']}
              width="100%"
            ></i-grid-layout>
          </i-hstack>
        </i-vstack>
      </i-scom-dapp-container>
    );
  }
}
