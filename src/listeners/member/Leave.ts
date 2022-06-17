import type { GuildMember } from 'discord.js';
import Listener from '~handler/Listener';

@Listener.Config({
    name: 'Member Left',
    event: Listener.Events.GuildMemberRemove,
    production: true
})
export default class GetXP extends Listener<typeof Listener.Events.GuildMemberRemove> {
    public async run(member: GuildMember) {
        // Ignore bots
        if (member.user.bot) return;
        // Send goodbye message
        this.client.tvf.channels.theWoods.send(`**${member.user.tag}** has exited the Forest.`);
    }
}
