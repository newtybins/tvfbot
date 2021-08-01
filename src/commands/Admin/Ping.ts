import { stripIndents } from 'common-tags';
import { CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message } from 'discord.js';
import TVFCommand from '../../struct/TVFCommand';

@ApplyOptions<CommandOptions>({
	name: 'ping',
	aliases: ['pong'],
	description: 'Checks my latency!',
	usage: 'ping',
	examples: [
		'ping'
	]
})
export default class Ping extends TVFCommand {
	async run(msg: Message) {
		// Create the embed
		const embed = this.client.utils.embed()
			.setTitle('pong <3')
			.setColor(this.client.constants.Colours.Green)
			.setThumbnail(msg.guild.iconURL())
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.setDescription('Calculating ping...');
		
		// Work out the ping
		const resultMsg = await msg.channel.send(embed);
		const ping = resultMsg.createdTimestamp - msg.createdTimestamp;

		// Update the embed
		embed.setDescription(stripIndents`
            Bot Latency: ${ping}ms
            API Latency: ${this.client.ws.ping}ms
        `);

		await resultMsg.edit(embed);
	}
}
