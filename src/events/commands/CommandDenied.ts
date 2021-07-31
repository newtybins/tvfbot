import { CommandDeniedPayload, Events, Event, UserError, EventOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<EventOptions>({
	name: 'commandDenied'
})
export default class CommandDenied extends Event<Events.CommandDenied> {
	async run({ context, message: content }: UserError, { message: msg }: CommandDeniedPayload) {
		if (Reflect.get(Object(context), 'silent')) return;

		return msg.channel.send(content);
	}
}
