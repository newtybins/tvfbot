import type { Message } from 'discord.js';
import { timeouts } from '~config';
import emitters from '~emitters';
import Listener from '~handler/Listener';

@Listener.Config({
    name: 'Message',
    event: Listener.Events.MessageCreate
})
export default class GetXP extends Listener<typeof Listener.Events.MessageCreate> {
    private xpCooldown: Set<string> = new Set<string>();

    public async run(message: Message) {
        // Ignore bots
        if (message.author.bot) return;

        // Reference the author's ID against the guild XP cooldown set
        if (this.xpCooldown.has(message.author.id)) return;

        // Ensure they recieve their XP
        emitters.levelling.emit('getXp', message.member);

        // Put them on timeout
        this.xpCooldown.add(message.author.id);
        setTimeout(() => this.xpCooldown.delete(message.author.id), timeouts.xp);
    }
}
