import { EventOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Roles, Channels } from '../Constants';
import TVFEvent from '../struct/TVFEvent';

@ApplyOptions<EventOptions>({
	name: 'ready',
	once: true
})
export default class Ready extends TVFEvent {
	async run() {
		// Load roles and channels
		this.client.tvfRoles = Roles(this.context.client.server);
		this.client.tvfChannels = Channels(this.context.client.server);

		if (this.client.production) {
			// Ensure all documents exist
		}
	}
}
