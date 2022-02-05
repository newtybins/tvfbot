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

    constructor(context: PieceContext, options: Command.Options) {
        super(context, options);

        this.client = this.container.client;
        this.logger = new Logger(this.client, this.name);
    }

    public onLoad() {
        this.logger.loader(`Successfully loaded command ${title(this.name)}!`);
        super.onLoad();
    }

    public onUnload() {
        this.logger.loader(`Successfully unloaded command ${title(this.name)}!`);
        super.onUnload();
    }

    public generateHelpEmbed(message: Command.Message): Embed {
        const embed = new Embed();

        embed
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setThumbnail(this.client.user.avatarURL())
            .setTitle(title(this.name));

        if (this.description) embed.setDescription(this.description);

        return embed;
    }
}

namespace Command {
    export type Options = CommandOptions;
    export type Message = DiscordMessage;
    export type Args = SapphireArgs;
    export type Context = SapphireCommand.RunContext;

    export const Config = (options: Options) => ApplyOptions<Options>(options);
}

export default Command;
