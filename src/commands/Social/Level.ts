import Command from '~handler/Command';
import { emojis, levelRewards } from '~config';
import { MessageAttachment } from 'discord.js';
import RankCard from '~structures/RankCard';

@Command.Config({
    name: 'level',
    description: "View a user's level!",
    args: [
        {
            name: '@user',
            required: false
        }
    ]
})
export default class Level extends Command {
    public async messageRun(message: Command.Message, args: Command.Args) {
        const memberToCheck = (await args.restResult('member')).value ?? message.member;

        const allUsers = (await this.client.db.user.findMany({ orderBy: { xp: 'desc' } })).filter(
            async user => (await this.client.tvf.server.members.list()).has(user.id)
        );

        const foundUser = allUsers.find(u => u.id === memberToCheck.id);

        const rank = allUsers.map(d => d.xp).indexOf(foundUser.xp) + 1;

        let color = memberToCheck.roles.highest.hexColor;
        if (color === '#000000') color = '#ffffff';

        // Build the rank card
        const rankCard = new RankCard({
            level: foundUser.level,
            xpForLevel: this.client.utils.calculateXp,
            user: memberToCheck,
            rank,
            stripAccents: true
        });

        rankCard.build().then(async data => {
            const attachment = new MessageAttachment(data, 'RankCard.png');
            const currentLevelReward = this.client.utils.findLevelReward(foundUser.level);

            const nextLevelReward = levelRewards[levelRewards.indexOf(currentLevelReward) + 1];
            const beginning =
                memberToCheck === message.member ? 'You are' : `${memberToCheck.user.username} is`;

            message.channel.send({
                content: `**${emojis.confetti} |** ${
                    nextLevelReward
                        ? ` ${beginning} ${(
                              this.client.utils.calculateXp(nextLevelReward.level) - foundUser.xp
                          ).toLocaleString()} xp away from **${await this.client.utils.findLevelRewardName(
                              nextLevelReward
                          )}!**`
                        : ''
                } ${
                    currentLevelReward
                        ? `${beginning} currently a **${await this.client.utils.findLevelRewardName(
                              nextLevelReward
                          )}**.`
                        : ''
                }`,
                files: [attachment]
            });
        });
    }
}
