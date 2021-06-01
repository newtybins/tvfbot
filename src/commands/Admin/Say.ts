import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

class Say extends Command {
	constructor() {
		super('say', {
			aliases: ['say'],
			category: 'Admin',
			description: 'Repeats a message through the bot!',
			args: [
				{
					id: 'message',
					type: 'string',
					match: 'rest'
				}
			]
		});

		this.usage = 'say <message>';
		this.examples = [
			'say Hello!',
			'say You\'re cute!'
		];
	}

	exec(msg: Message, { message }: { message: string }) {
		msg.delete(); // Clean up

		// Repeat the message
		if (message) {
			msg.channel.send(message);
		} else {
			this.client.sendDM(msg.author, `You did not specify anything for me to say!`);
		}
	}
}

module.exports = Say;
export default Say;