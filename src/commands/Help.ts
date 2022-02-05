import Command from '~handler/Command';
import Embed from '~structures/Embed';

interface Commands {
    [category: string]: string[];
}

@Command.Config({
    name: 'help',
    description: 'Find out more about how to use the bot!'
})
export default class Help extends Command {
    private get commands(): Commands {
        const commandStore = this.client.stores.get('commands');
        const commands: Commands = {};

        commandStore.forEach(({ category, name }) => {
            category ??= 'Core';

            if (!commands[category]) commands[category] = [];
            if (!commands[category].includes(name)) commands[category].push(name);
        });

        return commands;
    }

    public async messageRun(
        message: Command.Message,
        args: Command.Args,
        context: Command.Context
    ) {
        const commandName = (await args.restResult('string')).value;
        let embed: Embed;
        let appendCommandList = !commandName;

        if (commandName) {
            const command = this.client.stores.get('commands').get(commandName);

            if (command) {
                embed = command.generateHelpEmbed(message);
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
        }

        if (appendCommandList) {
            const categories = Object.keys(this.commands).sort((a, b) => a.localeCompare(b));

            categories.forEach(category => {
                const commands = this.commands[category];
                embed.addField(category, `\`\`\`${commands.join(', ')}\`\`\``);
            });
        }

        return await message.reply({ embeds: [embed] });
    }
}
