import { Inhibitor, Command } from 'discord-akairo';
import { Message } from 'discord.js';

class Developer extends Inhibitor {
    constructor() {
        super('dev', {
            reason: 'This command is restricted to developers only!',
        });
    }

    exec(msg: Message, command: Command) {
        if (command.categoryID === 'Developer') {
            return !this.client.isOwner(msg.author);
        }
    }
}

module.exports = Developer;
