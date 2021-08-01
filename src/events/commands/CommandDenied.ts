import { CommandDeniedPayload, Events, UserError, EventOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import TVFEvent from '../../struct/TVFEvent';

@ApplyOptions<EventOptions>({
	name: 'commandDenied'
})
export default class CommandDenied extends TVFEvent<Events.CommandDenied> {
	async run({ context, message: content }: UserError, { message: msg }: CommandDeniedPayload) {
		if (Reflect.get(Object(context), 'silent')) return;

		return msg.channel.send(content);
	}
}
