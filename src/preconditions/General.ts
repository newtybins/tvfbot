import { Precondition } from '@sapphire/framework';
import { Message } from 'discord.js';

export default class General extends Precondition {
	async run(msg: Message){
		const { tvfChannels } = this.context.client;
		
		if ([tvfChannels.general.id, tvfChannels.tw.id].includes(msg.channel.id)) {
			if (this.context.client.utils.isUser('Staff', msg.member)) return this.ok();
			else this.error({ message: 'Commands can not be run in general!' })
		}
	}
}

