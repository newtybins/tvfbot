import type { GuildMember } from 'discord.js';
import { levelRewards } from '~config';
import emitters from '~emitters';
import Listener from '~handler/Listener';
import Embed from '~structures/Embed';

@Listener.Config({
    name: 'Level Up',
    emitter: emitters.levelling,
    event: Listener.Events.Levelling.LevelUp,
    production: true
})
export default class LevelUp extends Listener<typeof Listener.Events.Levelling.LevelUp> {
    private levelReward(level: number) {
        return levelRewards.find(role =>
            level % 2 === 0 ? role.level === level : role.level === level - 1
        );
    }

    public async run(member: GuildMember, level: number) {
        const levelReward = this.levelReward(level) || levelRewards[levelRewards.length - 1];
        const levelRewardName = member.guild.roles.cache.get(levelReward.roleId).name;

        // Prepare the message
        const embed = new Embed('normal', member)
            .setTitle('Level Up!')
            .setThumbnail(member.avatarURL())
            .setDescription(
                `Congraulations, ${member.displayName}! Your magical ability has advanced to **Level ${level}**!`
            );

        if (level % 2 === 0) {
            embed.setDescription(`${embed.description} You are now a ${levelRewardName} <3`);
        } else {
            const nextLevelReward = levelRewards?.[levelRewards.indexOf(levelReward) + 1];

            if (nextLevelReward) {
                const xpAway = Math.round(
                    this.client.utils.calculateXp(nextLevelReward.level) -
                        this.client.utils.calculateXp(level)
                );
                const nextLevelRewardName = member.guild.roles.cache.get(
                    nextLevelReward.roleId
                ).name;

                embed.setDescription(
                    `${
                        embed.description
                    } You are now ${xpAway.toLocaleString()}xp from becoming a ${nextLevelRewardName} <3`
                );
            }
        }

        // Update the user's roles
        if (!member.roles.cache.has(levelReward.roleId)) {
            // Remove the old role
            const previousLevelReward = levelRewards?.[levelRewards.indexOf(levelReward) - 1];

            if (previousLevelReward) {
                await member.roles.remove(previousLevelReward.roleId);
            }

            // Add the new one
            await member.roles.add(levelReward.roleId);
        }

        // Send the message
        return await this.client.tvf.channels.levelUp.send({
            content: member.toString(),
            embeds: [embed]
        });
    }
}
