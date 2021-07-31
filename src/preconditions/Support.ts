import { Precondition, Command, Args, PreconditionOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message } from 'discord.js';

@ApplyOptions<PreconditionOptions>({
	name: 'support'
})
export default class SupportOnly extends Precondition {
	async run(msg: Message, command: Command<Args>){
		if (command.category.toLowerCase() === 'support') {
			if (msg.member.roles.cache.has(this.context.client.tvfRoles.admins.id) || msg.member.roles.cache.has(this.context.client.tvfRoles.staff.id)) return this.ok();
			else return this.error({ message: 'This command can only be used by server admins.' });
		}
	}
}
