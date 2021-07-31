import { Precondition, PreconditionOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message } from 'discord.js';

@ApplyOptions<PreconditionOptions>({
	name: 'general'
})
export default class General extends Precondition {
	async run(msg: Message){
		const { tvfChannels } = this.context.client;
		
		if ([tvfChannels.general.id, tvfChannels.tw.id].includes(msg.channel.id)) {
			if (this.context.client.utils.isUser('Staff', msg.member)) return this.ok();
			else return this.error({ message: 'Commands can not be run in general!' })
		}
	}
}

