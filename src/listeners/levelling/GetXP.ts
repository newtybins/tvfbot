import type { GuildMember } from 'discord.js';
import emitters from '~emitters';
import Listener from '~handler/Listener';

@Listener.Config({
    name: 'Get XP',
    emitter: emitters.levelling,
    event: Listener.Events.Levelling.GetXp,
    production: true
})
export default class GetXP extends Listener<typeof Listener.Events.Levelling.GetXp> {
    public async run(member: GuildMember) {
        // Give the user the XP
        const user = await this.client.db.user.upsert({
            where: { id: member.id },
            create: { id: member.id },
            update: {}
        });

        const xp = user.xp + Math.floor(Math.random() * 25) + 15;
        let level = user.level;
        const xpRequiredForNextLevel = this.client.utils.calculateXp(level + 1);

        if (xp > xpRequiredForNextLevel) {
            level++;
            emitters.levelling.emit('levelUp', member, level);
        }

        await this.client.db.user.updateMany({
            where: { id: member.id },
            data: { xp, level }
        });
    }
}
