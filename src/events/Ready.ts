import { Event, EventOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Roles, Channels } from '../Constants';

@ApplyOptions<EventOptions>({
	name: 'ready',
	once: true
})
export default class Ready extends Event {
	async run() {
		// Load roles and channels
		this.context.client.tvfRoles = Roles(this.context.client.server);
		this.context.client.tvfChannels = Channels(this.context.client.server);

		if (this.context.client.production) {
			// Ensure all documents exist
		}
	}
}
