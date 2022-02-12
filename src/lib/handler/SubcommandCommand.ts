import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandEntryMethod, SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Args as SapphireArgs } from '@sapphire/framework';
import type { GuildMember, Message as DiscordMessage } from 'discord.js';
import title from 'title';
import Client from '~structures/Client';
import Embed from '~structures/Embed';
import Logger from '~structures/Logger';
import Command from '~handler/Command';

class SubcommandCommand extends SubCommandPluginCommand {
    public client: Client;
    public logger: Logger;
    private subcommands: SubcommandCommand.Subcommand[];

    constructor(
        context: SubCommandPluginCommand.Context,
        { subcommands, ...options }: SubcommandCommand.Options
    ) {
        super(context, options);

        this.client = this.container.client;
        this.logger = new Logger(this.client, this.name);
        this.subcommands = subcommands;

        subcommands.forEach(subcommand => {
            const entry = new SubCommandEntryMethod({ input: subcommand.name });

            // @ts-ignore
            if (subcommand.default && !this.subCommands?.default)
                // @ts-ignore
                this.subCommands.default = entry;
            else {
                // @ts-ignore
                this.subCommands.entries ??= [];
                // @ts-ignore
                this.subCommands.entries.push(entry);
            }
        });
    }

    public onLoad() {
        this.logger.loader(`Successfully loaded command ${title(this.name)}!`);
        super.onLoad();
    }

    public onUnload() {
        this.logger.loader(`Successfully unloaded command ${title(this.name)}!`);
        super.onUnload();
    }

    public generateUsage(requestedBy: GuildMember): SubcommandCommand.Usage[] {
        let usages = this.subcommands.map(
            ({ name, args, restrictedTo, default: isDefault }): SubcommandCommand.Usage => {
                let permissionToView = true;

                if (restrictedTo?.length > 0) {
                    restrictedTo.forEach(role => {
                        if (!requestedBy.roles.cache.has(role) && permissionToView)
                            permissionToView = false;
                    });
                }

                if (permissionToView) {
                    let usage = `${this.name} ${name}`;

                    args?.forEach(argument => {
                        usage += ` ${argument.required ? '<' : '['}${argument.name}${
                            argument.options?.length > 0 ? `=${argument.options.join('|')}` : ''
                        }${argument.required ? '>' : ']'}`;
                    });

                    return {
                        subcommand: name,
                        usage,
                        default: isDefault ?? false
                    };
                } else {
                    return {
                        subcommand: null,
                        usage: null,
                        default: null
                    };
                }
            }
        );

        const defaultSubcommand = this.subcommands.find(subcommand => subcommand.default);

        if (defaultSubcommand) {
            let usage = `${this.name}`;

            defaultSubcommand?.args.forEach(argument => {
                usage += ` ${argument.required ? '<' : '['}${argument.name}${
                    argument.options?.length > 0 ? `=${argument.options.join('|')}` : ''
                }${argument.required ? '>' : ']'}`;
            });

            usages = [
                {
                    subcommand: defaultSubcommand.name,
                    usage,
                    default: defaultSubcommand.default ?? false
                },
                ...usages
            ];
        }

        return this.client.utils.sortAlphabetically(
            usages.filter(s => s),
            'subcommand'
        );
    }

    public generateHelpEmbed(message: SubcommandCommand.Message, prefix: string): Embed {
        const embed = new Embed('normal', message.member);
        const subcommands = this.subcommands
            .map(subcommand => {
                let permissionToView = true;

                if (subcommand?.restrictedTo?.length > 0) {
                    subcommand.restrictedTo.forEach(role => {
                        if (!message.member.roles.cache.has(role) && permissionToView)
                            permissionToView = false;
                    });
                }

                if (permissionToView) {
                    return `${subcommand.name}${
                        subcommand.description ? ` - ${subcommand.description.toLowerCase()}` : ''
                    }`;
                } else {
                    return null;
                }
            })
            .filter(s => s);

        embed
            .setThumbnail(this.client.user.avatarURL())
            .setTitle(title(this.name))
            .addField('Subcommands', `\`\`\`${subcommands.join('\n')}\`\`\``)
            .addField(
                'Usage',
                `\`\`\`${this.generateUsage(message.member)
                    .map(usage => `${prefix}${usage.usage}`)
                    .join('\n')}\`\`\``
            );

        if (this.description) embed.setDescription(this.description);

        return embed;
    }
}

namespace SubcommandCommand {
    export interface Subcommand {
        name: string;
        default?: boolean;
        args?: Command.Argument[];
        description?: string;
        restrictedTo?: string[];
    }

    export interface Usage {
        subcommand: string;
        usage: string;
        default: boolean;
    }

    export type Options = SubCommandPluginCommand.Options & {
        subcommands?: Subcommand[];
    };

    export type Context = SubCommandPluginCommand.RunContext;
    export type Message = DiscordMessage;
    export type Args = SapphireArgs;

    export const Config = (options: Options) =>
        ApplyOptions<Options>({
            ...options,
            subCommands: []
        });
}

export default SubcommandCommand;
