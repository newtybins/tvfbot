import {
    Command as SapphireCommand,
    CommandOptions,
    PieceContext,
    Args as SapphireArgs
} from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message as DiscordMessage } from 'discord.js';
import Client from '~structures/Client';
import Logger from '~structures/Logger';
import title from 'title';
import Embed from '~structures/Embed';

abstract class Command extends SapphireCommand {
    public client: Client;
    public logger: Logger;
    private args: Command.Argument[];
    private flags: Command.Flag[];

    constructor(
        context: PieceContext,
        { args, flags, developerOnly, ...options }: Command.Options
    ) {
        if (!options.preconditions) options.preconditions = [];

        // @ts-ignore
        options.preconditions.push({ name: 'BotCommandsOnly', context });

        // @ts-ignore
        if (developerOnly) options.preconditions.push({ name: 'DeveloperOnly', context });

        super(context, options);

        this.client = this.container.client;
        this.logger = new Logger(this.client, this.name);
        this.args = args ?? [];
    }

    public onLoad() {
        this.logger.loader(`Successfully loaded command ${title(this.name)}!`);
        super.onLoad();
    }

    public onUnload() {
        this.logger.loader(`Successfully unloaded command ${title(this.name)}!`);
        super.onUnload();
    }

    public get usage(): string {
        let usage = `${this.name}`;

        this.args.forEach(argument => {
            usage += ` ${argument.required ? '<' : '['}${argument.name}${
                argument.options?.length > 0 ? `=${argument.options.join('|')}` : ''
            }${argument.required ? '>' : ']'} ${this.flags.map(flag => `--${flag}`).join(' ')}`;
        });

        return usage;
    }

    public generateHelpEmbed(message: Command.Message, prefix: string): Embed {
        const embed = new Embed('normal', message.member);

        embed
            .setThumbnail(this.client.user.avatarURL())
            .setTitle(title(this.name))
            .addField('Usage', `\`\`\`${prefix}${this.usage}\`\`\``);

        if (this.description) embed.setDescription(this.description);

        return embed;
    }
}

namespace Command {
    export interface Argument {
        name: string;
        required?: boolean;
        options?: string[];
    }

    export type Flag = string;

    export type Options = CommandOptions & {
        args?: Argument[];
        flags?: Flag[];
        developerOnly?: boolean;
        fkOnly?: boolean;
    };

    export type Message = DiscordMessage;
    export type Args = SapphireArgs;
    export type Context = SapphireCommand.RunContext;

    export const Config = (options: Options) => ApplyOptions<Options>(options);
}

export default Command;
