import Command from '~handler/Command';
import util from 'util';
import { stripIndents } from 'common-tags';
import { Message, Util } from 'discord.js';

const NL = '!!NL!!';
const NL_PATTERN = new RegExp(NL, 'g');

const splitMessage = (
    text: string,
    { maxLength = 2_000, char = '\n', prepend = '', append = '' } = {}
) => {
    text = Util.verifyString(text);
    if (text.length <= maxLength) return [text];
    let splitText = [text];
    if (Array.isArray(char)) {
        while (char.length > 0 && splitText.some(elem => elem.length > maxLength)) {
            const currentChar = char.shift();
            if (currentChar instanceof RegExp) {
                splitText = splitText.flatMap(chunk => chunk.match(currentChar));
            } else {
                splitText = splitText.flatMap(chunk => chunk.split(currentChar));
            }
        }
    } else {
        splitText = text.split(char);
    }
    if (splitText.some(elem => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
    const messages = [];
    let msg = '';
    for (const chunk of splitText) {
        if (msg && (msg + char + chunk + append).length > maxLength) {
            messages.push(msg + append);
            msg = prepend;
        }
        msg += (msg && msg !== prepend ? char : '') + chunk;
    }
    return messages.concat(msg).filter(m => m);
};

@Command.Config({
    name: 'eval',
    description: 'Allows newt to evaluate code without having to make any changes to the bot!',
    preconditions: ['DeveloperOnly'],
    args: [
        {
            name: 'code',
            required: true
        }
    ],
    flags: ['noReturn']
})
export default class Eval extends Command {
    public hrStart: [number, number] | undefined;
    public lastResult: any = null;
    private readonly _sensitivePattern!: any;

    public async messageRun(message: Command.Message, args: Command.Args) {
        const noReturn = await args.getFlags('noReturn', 'nr');
        const code = await args.rest('string');

        let hrDiff;
        try {
            const hrStart = process.hrtime();
            this.lastResult = eval(code);
            hrDiff = process.hrtime(hrStart);
        } catch (error) {
            return message.channel.send(`Error while evaluating: \`${error}\``);
        }

        this.hrStart = process.hrtime();
        const result = this._result(this.lastResult, hrDiff, code);

        if (noReturn)
            return message.channel.send(
                `*Executed in **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${
                    hrDiff[1] / 1000000
                }ms.***`
            );
        if (Array.isArray(result))
            return result.map(
                async (res): Promise<Message | Message[]> => message.channel.send(res)
            );
        return message.channel.send(result);
    }

    private _result(
        result: any,
        hrDiff: [number, number],
        input: string | null = null
    ): string | string[] {
        const inspected = util
            .inspect(result, { depth: 0 })
            .replace(NL_PATTERN, '\n')
            .replace(this.sensitivePattern, '--snip--');
        const split = inspected.split('\n');
        const last = inspected.length - 1;
        const prependPart =
            inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'"
                ? split[0]
                : inspected[0];
        const appendPart =
            inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'"
                ? split[split.length - 1]
                : inspected[last];
        const prepend = `\`\`\`javascript\n${prependPart}\n`;
        const append = `\n${appendPart}\n\`\`\``;
        if (input) {
            return splitMessage(
                stripIndents`
				*Executed in **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.***
				\`\`\`javascript
				${inspected}
				\`\`\`
			`,
                { maxLength: 1900, prepend, append }
            );
        }

        return splitMessage(
            stripIndents`
			*Callback executed after **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.***
			\`\`\`javascript
			${inspected}
			\`\`\`
		`,
            { maxLength: 1900, prepend, append }
        );
    }

    private get sensitivePattern(): any {
        if (!this._sensitivePattern) {
            const token = this.client.token!.split('').join('[^]{0,2}');
            const revToken = this.client.token!.split('').reverse().join('[^]{0,2}');
            Object.defineProperty(this, '_sensitivePattern', {
                value: new RegExp(`${token}|${revToken}`, 'g')
            });
        }

        return this._sensitivePattern;
    }
}
