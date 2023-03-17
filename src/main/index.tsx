import {
  Module,
  customModule,
  Label,
  HStack,
  GridLayout,
  moment,
  Styles,
  application
} from "@ijstech/components";
import { IConfig, PageBlock } from "@pageblock-randomizer/global";
import './index.css';
import { getRoundByReleaseTime, getRandomizerResult } from "./utils";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-randomizer"]: RandomizerBlock;
    }
  }
}
const Theme = Styles.Theme.ThemeVars;

@customModule
export class RandomizerBlock extends Module implements PageBlock {
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
  private timer: any;
  private oldTag: any = {};
  tag: any = {};

  async init() {
    super.init();
    // application.EventBus.dispatch('embedInitialized', this);
  }

  async getData() {
    return this._data;
  }

  async setData(value: IConfig) {
    console.log("set data");
    this._data = value;
    if (this._data.releaseTime) {
      this._data.releaseUTCTime = moment(Number(this._data.releaseTime)).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
    }
    if (!this._data.round && this._data.releaseTime) {
      this._data.round = await getRoundByReleaseTime(Number(this._data.releaseTime));
    }
    await this.refreshApp();
  }

  async refreshApp() {
    this.lbRound.caption = this._data.round?.toString() || '';
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
      this.lbReleaseTime.caption = moment(Number(this._data.releaseTime)).format('YYYY-MM-DD HH:mm');
      if (this.timer) {
        clearInterval(this.timer);
      }
      const refreshCountdown = () => {
        const days = moment(Number(this._data.releaseTime)).diff(moment(), 'days');
        const hours = moment(Number(this._data.releaseTime)).diff(moment(), 'hours') - days * 24;
        const mins = moment(Number(this._data.releaseTime)).diff(moment(), 'minutes') - days * 24 * 60 - hours * 60;
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

  getTag() {
    return this.tag;
  }

  async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop))
        this.tag[prop] = newValue[prop];
    }
    this.updateTheme();
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    this.updateStyle('--text-primary', this.tag?.fontColor);
    this.updateStyle('--background-main', this.tag?.backgroundColor);
    this.updateStyle('--colors-primary-main', this.tag?.roundNumberFontColor);
    this.updateStyle('--colors-warning-contrast_text', this.tag?.winningNumberFontColor);
    this.updateStyle('--colors-warning-main', this.tag?.winningNumberBackgroundColor);
    this.updateStyle('--text-secondary', this.tag?.nextDrawFontColor);
  }

  getEmbedderActions() {
    return this.getActions();
  }
  
  getActions() {
    const actions = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          return {
            execute: async () => {
              this._oldData = {...this._data};
              if (userInputData.releaseUTCTime != undefined) {
                this._data.releaseUTCTime = userInputData.releaseUTCTime;
                this._data.releaseTime = moment.utc(this._data.releaseUTCTime).valueOf().toString();
              }
              if (userInputData.releaseTime != undefined) {
                this._data.releaseTime = userInputData.releaseTime;
                this._data.releaseUTCTime = moment(Number(this._data.releaseTime)).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
              }
              if (userInputData.numberOfValues != undefined) this._data.numberOfValues = userInputData.numberOfValues;
              if (userInputData.from != undefined) this._data.from = userInputData.from;
              if (userInputData.to != undefined) this._data.to = userInputData.to;
              this._data.round = await getRoundByReleaseTime(Number(this._data.releaseTime));
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
        userInputDataSchema: {
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
              this.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = {...this.oldTag};
              if (builder) builder.setTag(this.tag);
              this.setTag(this.tag);
            },
            redo: () => {}
          }
        },
        userInputDataSchema: {
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
    ]
    return actions
  }

  render() {
    const paddingTimeUnit = { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem'};
    return (
      <i-panel>
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
      </i-panel>
    );
  }
}
