import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';

class CommandBlocked extends Listener {
	constructor() {
		super('commandBlocked', {
			emitter: 'commandHandler',
            event: 'commandBlocked'
		});
	}

	exec(msg: Message, _command, reason: string) {
		if (reason === 'Commands can not be run in general!') {
			this.client.sendDM(msg.author, `**${this.client.constants.emojis.cross}  |** Sorry, but you are not allowed to run commands in the general chats!`)
		} else {
			msg.channel.send(`**${this.client.constants.emojis.cross}  |** Sorry, but you are not allowed to run that command!`);
		}
	}
}

module.exports = CommandBlocked;