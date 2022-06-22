import { blank, colours, emojis } from '~config';
import Command from '~handler/Command';
import Embed from '~structures/Embed';

@Command.Config({
    name: 'suggest',
    description: 'Make a suggestion for the server!',
    args: [
        {
            name: 'suggestion',
            required: true
        }
    ]
})
export default class Suggest extends Command {
    public async messageRun(message: Command.Message, args: Command.Args) {
        const { value: suggestionContent } = await args.restResult('string');
        let responseEmbed: Embed;

        if (!suggestionContent) {
            responseEmbed = new Embed('error', message.member).setDescription(
                'Remember, you must provide a body for your suggestion!'
            );
        } else {
            const suggestionMessage = await this.client.tvf.channels.suggestions.send({
                content: `Incoming suggestion from ${message.author.username}...`
            });

            // Write to the database
            const suggestion = await this.client.db.suggestion.create({
                data: {
                    authorId: message.member.id,
                    content: suggestionContent,
                    messageId: suggestionMessage.id
                }
            });

            await suggestionMessage.edit({
                content: blank,
                embeds: [
                    new Embed('normal', message.member)
                        .setTitle(`New suggestion from ${message.member.user.username}!`)
                        .setDescription(suggestionContent)
                        .setColor(colours.white)
                        .setThumbnail(message.member.avatarURL())
                        .setFooter({
                            text: `Suggestion #${suggestion.suggestionId}`,
                            iconURL: this.client.tvf.server.iconURL()
                        })
                ]
            });

            await suggestionMessage.react(emojis.upvote);
            await suggestionMessage.react(emojis.downvote);

            responseEmbed = new Embed('success', message.member).setDescription(
                `Your suggestion has been successfully posted in ${this.client.tvf.channels.suggestions.toString()}! Go and check it out (:`
            );
        }

        await message.reply({ embeds: [responseEmbed] });
    }
}
