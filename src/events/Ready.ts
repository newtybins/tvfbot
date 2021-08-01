import { EventOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Roles, Channels } from '../Constants';
import TVFEvent from '../struct/TVFEvent';
import moment from 'moment';

@ApplyOptions<EventOptions>({
	name: 'ready',
	once: true
})
export default class Ready extends TVFEvent<Events.Ready> {
	async run() {
		// Load roles and channels
		this.client.tvfRoles = Roles(this.context.client.server);
		this.client.tvfChannels = Channels(this.context.client.server);
		this.client.botLogger.info('yes')

		// Load categories
		this.client.categories = new Set<string>();

		for (const [, command] of this.client.stores.get('commands')) {
			console.log(command.category);
			this.client.categories.add(command.category);
		}

		console.log(this.client.categories);

		if (this.client.production) {
			// Ensure all documents exist
			this.client.server.members.cache.forEach(async member => {
				if (!member.user.bot) { 
					const user = await this.client.db.user.findUnique({ where: { id: member.id }});
					if (!user) await this.client.db.user.create({ data: { id: member.id }})
				}
			});

			// Ensure all private vents are ticking
			const vents = await this.client.db.private.findMany();
			vents.forEach(async v => {
				const expiresAt = moment(v.requestedAt).add(this.client.constants.privateTimeout, 'ms');
				const ms = expiresAt.diff(moment(), 'ms');
				const owner = await this.client.db.user.findUnique({ where: { privateID: v.id }});
				const user = this.client.users.cache.get(owner.id);
				
				if (!v.startedAt) {
					// PrivateRequest.prototype.privateTimeouts(v, user, ms, this.client as TVFClient);
					this.client.botLogger.db(`Loaded Vent ${v.id} for User ${this.client.userLogCompiler(user)}!`);
				}
			});
		}

		this.client.botLogger.info('TVF Bot is ready!');
	}
}
