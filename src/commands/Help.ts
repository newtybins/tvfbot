import { CommandOptions, Args, CommandStore, CommandContext } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message } from 'discord.js';
import TVFCommand from '../struct/TVFCommand';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'Shows you this command! You may also provide a command, which will return info about that command!',
	usage: 'help [command]',
	examples: [
		'help',
		'help ping'
	]
})
export default class Help extends TVFCommand {
	private _commands!: CommandStore;

	async run(msg: Message, args: Args, context: CommandContext) {
		this._commands = this.client.stores.get('commands');
		const commandName: string = await args.pick('string').catch(() => null);

		const embed = this.client.utils.embed()
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.setColor(this.client.constants.Colours.Green)
			.setThumbnail(this.client.user.avatarURL());

		if (!commandName) {
			// Prepare the embed for a list of commands
			embed
				.setTitle('TVF Bot Commands')
				.setDescription(`For detailed information run \`${context.prefix}help <commandName>\``);

			// Add a field for each category
			this.client.categories.forEach((category) => {
				const commands = this._commands.filter((cmd: TVFCommand) => cmd.category.toLowerCase() === category.toLowerCase());
				commands.forEach(cmd => console.log(cmd.name))
				embed.addField(category, `\`\`\`${commands.map((cmd) => cmd.name).join(', ')}\`\`\``)
			});

			this.client.botLogger.command(`${this.client.userLogCompiler(msg.author)} requested a list of commands!`);
		} else {
			// Find the command that has been searched for
			const command = this._commands.find(c => c.name === commandName) as TVFCommand;

			if (command) {
				try {
					// Populate the embed
					embed
						.setTitle(`TVF Bot Help - ${commandName}`)
						.setDescription(command.description)
						.addField('Usage', `\`\`\`${context.prefix}${command.usage}\`\`\``)
						.addField('Examples', `\`\`\`${command.examples.map(example => `${context.prefix}${example}`).join('\n')}\`\`\``);

					this.client.botLogger.command(`${this.client.userLogCompiler(msg.author)} requested information about the ${commandName} command!`);
				} catch {
					embed.fields = [];
					embed
						.setTitle('That command\'s help object is not complete!')
						.setDescription('Please let newt know and they\'ll get right to fixing it!')
						.setColor(this.client.constants.Colours.Red);

					this.client.botLogger.error(`${commandName}'s help object is incomplete - woops!`);
				}
			} else {
				embed
					.setTitle('I could not find that command!')
					.setDescription(`Sorry, but I could not find any information about the command \`${commandName}\``)
					.setColor(this.client.constants.Colours.Red);
			}
		}

		msg.channel.send(embed);
	}
}
