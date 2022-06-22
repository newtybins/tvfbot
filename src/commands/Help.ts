import { newtId } from '~config';
import Command from '~handler/Command';
import Embed from '~structures/Embed';

enum CommandPermisions {
    None,
    ForestKeeper,
    Developer
}

interface Commands {
    [category: string]: { name: string; access: CommandPermisions[] }[];
}

@Command.Config({
    name: 'help',
    description: 'Find out more about how to use the bot!',
    args: [
        {
            name: 'command'
        }
    ]
})
export default class Help extends Command {
    private get commands(): Commands {
        const commandStore = this.client.stores.get('commands');
        const commands: Commands = {};

        commandStore.forEach(({ category, name }) => {
            category ??= 'Core';

            if (!commands[category]) commands[category] = [];
            if (!commands[category].find(o => o.name === name)) {
                const command = commandStore.get(name);
                let permissions = [CommandPermisions.None];

                const preconditions = command.preconditions.entries.map(
                    entry => entry['name'] as string
                );

                if (preconditions.includes('DeveloperOnly'))
                    permissions = [CommandPermisions.Developer];
                else if (preconditions.includes('ForestKeeperOnly'))
                    permissions = [CommandPermisions.Developer, CommandPermisions.ForestKeeper];

                commands[category].push({ name, access: permissions });
            }
        });

        return commands;
    }

    public async messageRun(
        message: Command.Message,
        args: Command.Args,
        context: Command.Context
    ) {
        const { value: commandName } = await args.restResult('string');
        let embed: Embed;
        let appendCommandList = !commandName;

        if (commandName) {
            const command = this.client.stores.get('commands').get(commandName);

            if (command) {
                embed = command.generateHelpEmbed(message, context.commandPrefix);
            } else {
                embed = new Embed('error')
                    .setTitle('Command not found!')
                    .setDescription('Please make sure you choose one from the list below!');

                appendCommandList = true;
            }
        } else {
            embed = new Embed()
                .setTitle('I am here to help! (:')
                .setDescription(
                    `You can see a list of all of my commands below! If you would like to learn more about a specific one, you can find out more by running \`${context.commandPrefix}${context.commandName} <command>\``
                );

            appendCommandList = true;
        }

        if (appendCommandList) {
            const categories = Object.keys(this.commands).sort();
            let permission = CommandPermisions.None;

            if (message.author.id === newtId) permission = CommandPermisions.Developer;
            else if (message.member.roles.cache.has(this.client.tvf.roles.forestKeepers.id))
                permission = CommandPermisions.ForestKeeper;

            categories.forEach(category => {
                const commands = this.commands[category].filter(command =>
                    command.access.includes(permission)
                );
                embed.addField(category, `\`\`\`${commands.join(', ')}\`\`\``);
            });
        }

        return await message.reply({ embeds: [embed] });
    }
}
