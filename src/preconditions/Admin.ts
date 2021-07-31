import { Precondition, Command, Args, PreconditionOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message } from 'discord.js';

@ApplyOptions<PreconditionOptions>({
	name: 'admin'
})
export default class AdminOnly extends Precondition {
	async run(msg: Message, command: Command<Args>){
		if (command.category.toLowerCase() === 'admin') {
			if (msg.member.roles.cache.has(this.context.client.tvfRoles.admins.id)) return this.ok();
			else return this.error({ message: 'This command can only be used by server admins.' });
		}
	}
}
