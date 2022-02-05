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

    constructor(context: PieceContext, { args, ...options }: Command.Options) {
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

    private get usage(): string {
        let usage = `${this.name}`;

        this.args.forEach(argument => {
            usage += ` ${argument.required ? '<' : '['}${argument.name}${
                argument.required ? '>' : ']'
            }`;
        });

        return usage;
    }

    public generateHelpEmbed(message: Command.Message): Embed {
        const embed = new Embed('normal', message.author);

        embed
            .setThumbnail(this.client.user.avatarURL())
            .setTitle(title(this.name))
            .addField('Usage', this.usage);

        if (this.description) embed.setDescription(this.description);

        return embed;
    }
}

namespace Command {
    export interface Argument {
        name: string;
        required?: boolean;
    }

    export type Options = CommandOptions & {
        args?: Argument[];
    };

    export type Message = DiscordMessage;
    export type Args = SapphireArgs;
    export type Context = SapphireCommand.RunContext;

    export const Config = (options: Options) => ApplyOptions<Options>(options);
}

export default Command;
