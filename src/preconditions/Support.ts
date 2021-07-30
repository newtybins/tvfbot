import { Precondition, Command, Args } from '@sapphire/framework';
import { Message } from 'discord.js';

export default class SupportOnly extends Precondition {
	async run(msg: Message, command: Command<Args>){
		if (command.category.toLowerCase() === 'support' && (!msg.member.roles.cache.has(this.context.client.tvfRoles.staff.admins.id) || !msg.member.roles.cache.has(this.context.client.tvfRoles.staff.support.id))) return this.error({ message: 'This command can only be used by server admins.' });
		else this.ok();
	}
}
