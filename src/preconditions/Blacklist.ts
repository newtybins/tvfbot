import { Precondition } from '@sapphire/framework';
import { Message } from 'discord.js';

export default class Blacklist extends Precondition {
	async run(msg: Message){
		const blacklisted = await this.context.client.db.blacklist.findMany();
		const ids = blacklisted.map(u => u.id);

		if (!ids.includes(msg.author.id)) return this.ok();
		else return this.error({ message: 'Sorry, but you have been blacklisted from the bot!' });
	}
}
