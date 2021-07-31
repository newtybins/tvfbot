import { CommandOptions, Args, CommandStore } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import TVFCommand from '../struct/TVFCommand';
import * as Pagination from 'discord-paginationembed';

@ApplyOptions<CommandOptions>({
	description: 'Shows you this command!',
	detailedDescription: 'You may also provide a command, which will return info about that command!'
})
export default class Help extends TVFCommand {
	private _commands!: CommandStore;

	async run(msg: Message, args: Args) {
		const commandName: string = await args.pick('string').catch(() => null);
		if (!commandName) return this.menu(msg);

		// Find the command
		this._commands = this.context.client.stores.get('commands');
		const command = this._commands.get(commandName.toLowerCase()) || this._commands.find(cmd => cmd.aliases.includes(commandName.toLowerCase()));
		
		if (!command) throw `Command not found. To vie all commands, run \`${args.commandContext.commandPrefix}help\``;

		// Generate the embed
		const embed = this.context.client.utils.embed()
			.setColor(this.context.client.constants.Colours.Green)
			.setThumbnail(this.context.client.user.avatarURL())
			.setTitle(command.name)
			.setDescription(command.description);
		
		if (command.aliases.length) embed.addField('❯ Aliases', command.aliases.map(alias => `\`${alias}\``).join(' '));
		if (command.detailedDescription) embed.addField('❯ Detailed Description', command.detailedDescription);

		return msg.channel.send(embed);
	}

	private async menu(msg: Message) {
		const categories = new Set<string>();
		this._commands = this.context.client.stores.get('commands');
		console.log(this._commands.values())

		for (const [, command] of this._commands.filter(cmd => cmd.category.toLowerCase() !== 'admin')) {
			categories.add(command.category);
		}

		const embeds: MessageEmbed[] = [];

		categories.forEach(category => {
			const commands = this._commands.filter(cmd => cmd.category.toLowerCase() === category.toLowerCase());
			const embed = this.context.client.utils.embed()
				.setTitle(category)
				.setDescription(commands.map(cmd => `\`${cmd.name}\` → ${cmd.description || 'No description was provided'}`));

			embeds.push(embed);
		});

		new Pagination.Embeds()
			.setArray(embeds)
			.setAuthorizedUsers([msg.author.id])
			.setChannel(msg.channel as TextChannel)
			.setPageIndicator(true)
			.setThumbnail(this.context.client.user.avatarURL())
			.setColor(this.context.client.constants.Colours.Green)
			.build();
	}
}
