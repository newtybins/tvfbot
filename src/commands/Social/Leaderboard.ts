import TVFCommand from '../../struct/TVFCommand';
import { Message, EmbedFieldData } from 'discord.js';
import { stripIndents } from 'common-tags';

class Leaderboard extends TVFCommand {
    constructor() {
        super('leaderboard', {
            aliases: ['leaderboard', 'lb'],
            category: 'Core',
            description:
                'Shows a leaderboard of level rankings! You may specify a page number if you wish, if not page 1 will be returned.',
            args: [
                {
                    id: 'page',
                    type: 'number',
                    default: 1,
                },
            ],
        });

        this.usage = 'leaderboard [page]';
        this.examples = ['leaderboard', 'leaderboard 1'];
    }

    async exec(msg: Message, { page }: { page: number }) {
        const users = await this.client.db.user.findMany({
            orderBy: { xp: 'desc' },
        });
        const user = users.find((u) => u.id === msg.author.id);
        const authorRank = users.map((d) => d.xp).indexOf(user.xp) + 1;
        const pages = Math.ceil(users.length / 10);
        const filteredUsers = users.filter(
            (user) => this.client.server.member(user.id) !== null,
        );

        // Ensure that the provided page is in range
        if (page > pages || page <= 0) {
            const error = this.client.utils
                .embed()
                .setTitle(`Page ${page} is out of range!`)
                .setDescription(
                    `There is a grand total of ${pages} pages that can be viewed. Please try again with a valid page number.`,
                )
                .setColor(this.client.constants.Colours.Red)
                .setThumbnail(this.client.server.iconURL());
            return msg.channel.send(error);
        }

        // Create the embed
        const embed = this.client.utils
            .embed()
            .setAuthor(
                `${this.client.server.name} Leaderboard`,
                this.client.server.iconURL(),
            )
            .setColor(this.client.constants.Colours.Green)
            .setThumbnail(this.client.server.iconURL())
            .setDescription(
                `Displaying data for ranks ${page * 10 - 9} to ${page * 10}...`,
            )
            .setFooter(
                `Page ${page}/${pages} • Your leaderboard rank: ${authorRank}`,
                msg.author.avatarURL(),
            );

        // Generate field data
        const fields: EmbedFieldData[] = await Promise.all(
            filteredUsers.slice(page * 10 - 10, page * 10).map(async (user) => {
                const rank = filteredUsers.indexOf(user) + 1;
                const profile = await this.client.users.fetch(user.id);
                const levelReward = this.client.social.levelReward(user.level);
                const xp = (
                    user.xp - this.client.social.xpFor(user.level)
                ).toLocaleString();
                const lifetimeXp = user.xp.toLocaleString();

                return {
                    name: `#${rank} - ${profile.tag}`,
                    value: stripIndents`
                • Level **${user.level}** ${
                        levelReward ? `(${levelReward.name})` : ''
                    }
                • **${xp}** xp
                • **${lifetimeXp}** lifetime xp
            `,
                };
            }),
        );

        // Send the embed
        embed.addFields([
            {
                name: this.client.constants.blank,
                value: this.client.constants.blank,
            },
            ...fields,
        ]);
        msg.channel.send(embed);

        this.client.logger.command(
            `${this.client.userLogCompiler(
                msg.author,
            )} requested page ${page}/${pages} of the server level leaderboard.`,
        );
    }
}

module.exports = Leaderboard;
export default Leaderboard;
