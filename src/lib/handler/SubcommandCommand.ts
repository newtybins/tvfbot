import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Message as DiscordMessage } from 'discord.js';
import title from 'title';
import Client from '~structures/Client';
import Embed from '~structures/Embed';
import Logger from '~structures/Logger';
import Command from '~handler/Command';

class SubcommandCommand extends SubCommandPluginCommand {
    public client: Client;
    public logger: Logger;
    private args: SubcommandCommand.Arguments;

    constructor(
        context: SubcommandCommand.Context,
        { args, ...options }: SubcommandCommand.Options
    ) {
        super(context, options);

        this.client = this.container.client;
        this.logger = new Logger(this.client, this.name);
        this.args = args;
    }

    public onLoad() {
        this.logger.loader(`Successfully loaded command ${title(this.name)}!`);
        super.onLoad();
    }

    public onUnload() {
        this.logger.loader(`Successfully unloaded command ${title(this.name)}!`);
        super.onUnload();
    }

    private get usage(): string[] {
        const usage = [];
        const subcommands = Object.keys(this.args);

        subcommands.forEach(subcommand => {
            const args = this.args[subcommand];
            let subcommandUsage = `${this.name}`;

            args.forEach(argument => {
                subcommandUsage += ` ${argument.required ? '<' : '['}${argument.name}${
                    argument.options?.length > 0 ? `=${argument.options.join('|')}` : ''
                }${argument.required ? '>' : ']'}`;
            });

            usage.push(subcommandUsage);
        });

        // Argumentless subcommands
        // @ts-ignore
        this.subCommands.entries
            .map(subcommand => subcommand.input)
            .filter(subcommand => !subcommands.includes(subcommand))
            .forEach(subcommand => usage.push(`${this.name} ${subcommand}`));

        return this.client.utils.sortAlphabetically(usage);
    }

    public generateHelpEmbed(message: SubcommandCommand.Message, prefix: string): Embed {
        const embed = new Embed('normal', message.member);
        // @ts-ignore
        const subcommands = [...this.subCommands.entries, this.subCommands?.default]
            .filter(s => s)
            .map(subcommand => subcommand.input);

        embed
            .setThumbnail(this.client.user.avatarURL())
            .setTitle(title(this.name))
            .addField('Subcommands', `\`\`\`${subcommands.join('\n')}\`\`\``)
            .addField(
                'Usage',
                `\`\`\`${this.usage.map(usage => `${prefix}${usage}`).join('\n')}\`\`\``
            );

        if (this.description) embed.setDescription(this.description);

        return embed;
    }
}

namespace SubcommandCommand {
    export interface Arguments {
        [subcommand: string]: Command.Argument[];
    }

    export type Options = SubCommandPluginCommand.Options & {
        args?: Arguments;
    };

    export type Context = SubCommandPluginCommand.Context;
    export type Message = DiscordMessage;

    export const Config = (options: Options) => ApplyOptions<Options>(options);
}

export default SubcommandCommand;
