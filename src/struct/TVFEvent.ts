import { Event, EventOptions, PieceContext } from '@sapphire/framework';
import { ClientEvents } from 'discord.js';
import TVFClient from './TVFClient';

export default abstract class TVFEvent<E extends keyof ClientEvents | symbol = ''> extends Event<E> {
	public client: TVFClient;

	public constructor(context: PieceContext, { name, ...options }: EventOptions) {
		super(context, { name, ...options });
		
		this.client = this.context.client;
	}
}
