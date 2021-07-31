import { GuildMember, Message, MessageEmbed, User } from 'discord.js';
import TVFClient from './TVFClient';
import * as jimp from 'jimp';
import * as path from 'path';
import { Canvas } from 'canvas';

export default class TVFUtils {	
	private client: TVFClient;

	/**
	 * Initialises an instance of the TVFUtils helper
	 * @param client An instance of TVF Bot
	 */
	constructor(client: TVFClient) {
		this.client = client;
	}

	/**
	 * Checks if a user has a staff role.
	 * @param {StaffRole | 'Staff'} role
	 * @param {Discord.GuildMember} member
	 */
	isUser(role: StaffRole, member: GuildMember): boolean {
		return role === 'Support' ? member.roles.cache.has(this.client.tvfRoles.support.id) || member.roles.cache.has(this.client.tvfRoles.supportHead.id) || member.roles.cache.has(this.client.tvfRoles.admins.id)
			: role === 'Moderation' ? member.roles.cache.has(this.client.tvfRoles.moderators.id) || member.roles.cache.has(this.client.tvfRoles.modHead.id) || member.roles.cache.has(this.client.tvfRoles.admins.id)
				: role === 'Admin' ? member.roles.cache.has(this.client.tvfRoles.admins.id)
					: role === 'Staff' ? member.roles.cache.has(this.client.tvfRoles.staff.id)
						: false;
	}

	/**
	 * Send a DM to a member!
	 * @param {User} user
	 * @param {MessageContent} content
	 */
	async sendDM(user: User, content: MessageContent): Promise<Message> {
		return user.send(content).catch(() => {
			const embed = this.client.utils.embed()
				.setTitle('Sorry, I was unable to DM you!')
				.setDescription('I tried to send you a DM, but there was an issue! This may be because you are not accepting DMs from server members. Please check if you have got it enabled, as shown below!')
				.setThumbnail(this.client.server.iconURL())
				.setImage('https://i.imgur.com/iY7a8RO.png');

			this.client.tvfChannels.discussion.send(user, embed);
		}) as Promise<Message>;
	}

	/**
	 * Overlays a pride flag over an image buffer.
	 * @param {Buffer} buffer
	 * @param {string} type
	 * @param {number} opacity
	 */
	async pride(buffer: Buffer, type: string, opacity: number): Promise<Buffer> {
		// load the necessary images
		const image = await jimp.read(buffer);
		const flag = await jimp.read(path.resolve(`assets/pride/${type}.png`));

		// resize the flag and set opacity
		flag.resize(image.getWidth(), image.getHeight());
		flag.opacity(opacity);

		// overlay the flag onto the image
		image.blit(flag, 0, 0);

		// return the manipulated image's buffer
		return image.getBufferAsync(jimp.MIME_PNG);
	}

	/**
	 * Resizes font size based on canvas
	 * @param canvas The canvas instance
	 * @param fontSize The initial font size
	 * @param text The text to resize for
	 * @returns The new definition for the font
	 */
	applyText(canvas: Canvas, fontSize: number, text: string): string {
		const context = canvas.getContext('2d');
	
		do {
			context.font = `${fontSize -= 5}px League Spartan`;
		} while (context.measureText(text).width > canvas.width - 475);

		return context.font;
	}

	embed() {
		return new MessageEmbed();
	}
}
