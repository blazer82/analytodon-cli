import {Command, Flags} from '@oclif/core';
import {logger} from '../../helpers/logger';
import {completeLogging} from '../../helpers/completeLogging';

export default class Hello extends Command {
    static description = 'Say hello';

    static examples = [
        `$ oex hello friend --from oclif
hello friend from oclif!
`,
    ];

    static flags = {
        from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
    };

    static args = [{name: 'person', description: 'Person to say hello to', required: true}];

    async run(): Promise<void> {
        const {args, flags} = await this.parse(Hello);

        logger.info(`hello ${args.person} from ${flags.from}!`);

        await completeLogging();
    }
}
