import TVFCommand from '../struct/TVFCommand';
import { Message } from 'discord.js';

class Suggest extends TVFCommand {
    constructor() {
        super('suggest', {
            aliases: ['suggest'],
            description: 'Make a suggestion!',
            args: [
                {
                    id: 'suggestionText',
                    type: 'text',
                    match: 'rest',
                },
            ],
        });

        this.usage = 'suggest <suggestion>';
        this.examples = ['suggest My really cool idea!'];
    }

    async exec(msg: Message, { suggestionText }: { suggestionText: string }) {
        // Create the suggestion
        const suggestion = await this.client.db.suggestion.create({
            data: {
                authorID: msg.author.id,
                text: suggestionText,
            },
        });

        // Post it
        const embed = this.client.social.suggestionEmbed(suggestion);

        const message =
            await this.client.tvfChannels.community.suggestions.send(embed);
        const upvote = this.client.server.emojis.cache.get(
            this.client.constants.Emojis.Upvote,
        );
        const downvote = this.client.server.emojis.cache.get(
            this.client.constants.Emojis.Downvote,
        );

        await message.react(upvote);
        await message.react(downvote);

        // Update the suggestion to include the message ID
        await this.client.db.suggestion.update({
            where: { id: suggestion.id },
            data: { messageID: message.id },
        });

        // Mark the message as read
        await msg.react(this.client.constants.Emojis.Tick);
    }
}

module.exports = Suggest;
export default Suggest;
