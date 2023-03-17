import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomRandomizer from '@scom/scom-randomizer'
@customModule
export default class Module1 extends Module {
    private randomizer1: ScomRandomizer;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
        this.randomizer1 = await ScomRandomizer.create({
            releaseUTCTime: '2023-09-01T12:42:00.000Z',
            numberOfValues: 15,
            from: 1,
            to: 100
        });
        this.mainStack.appendChild(this.randomizer1);
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{top: '1rem', left: '1rem'}} gap="2rem">
                <i-scom-randomizer
                    releaseUTCTime='2023-03-01T00:00:00.000Z'
                    numberOfValues={10}
                    from={1}
                    to={100}
                ></i-scom-randomizer>
            </i-hstack>
        </i-panel>
    }
}