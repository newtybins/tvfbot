import { Precondition, PreconditionOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message } from 'discord.js';

@ApplyOptions<PreconditionOptions>({
	name: 'blacklist'
})
export default class Blacklist extends Precondition {
	async run(msg: Message){
		const blacklisted = await this.context.client.db.blacklist.findMany();
		const ids = blacklisted.map(u => u.id);

		if (!ids.includes(msg.author.id)) return this.ok();
		else return this.error({ message: 'Sorry, but you have been blacklisted from the bot!' });
	}
}
