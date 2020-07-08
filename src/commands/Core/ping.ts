import { Message } from 'discord.js';

export default {
	name: 'ping',
	description: 'Check if I\'m still alive <3',
	allowGeneral: true,
	run: async (tvf, msg) => {
		const embed = tvf.createEmbed({ author: true }, msg)
			.setTitle('Pong!');

		const msg2 = (await msg.channel.send(embed)) as Message;
		const ping = Math.round(msg2.createdTimestamp - msg.createdTimestamp);

		return msg2.edit(embed.setTitle(`Pong! - ${ping}ms`));
	}
} as Command;