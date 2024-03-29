import TVFCommand from '../../struct/TVFCommand';
import { Message } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import request from 'request';

const flags = fs
    .readdirSync(path.resolve(__dirname, '..', '..', '..', 'assets', 'pride'))
    .map((f) => f.slice(0, f.length - 4));

class Pride extends TVFCommand {
    constructor() {
        super('pride', {
            aliases: ['pride'],
            description: `Put a pride flag over your profile picture, or a picture of your choice! If no attachment is provided, your profile picture will be used. Choose a flag from the following:\n\`\`\`${flags.join(
                ', '
            )}\n\`\`\``,
            args: [
                {
                    id: 'flag',
                    type: 'lowercase',
                    index: 0,
                    prompt: {
                        start: (msg: Message): string =>
                            `${
                                msg.author
                            }, what flag would you like to overlay? Select from the list below:\`\`\`${flags.join(
                                ', '
                            )}\`\`\``
                    }
                },
                {
                    id: 'opacity',
                    type: 'number',
                    index: 1,
                    default: 50
                }
            ]
        });

        this.usage = 'pride <flag> [opacity]';
        this.examples = ['pride agender', 'pride ally 70'];
    }

    async exec(
        msg: Message,
        { flag, opacity }: { flag: string; opacity: number }
    ) {
        this.client.utils.deletePrompts(msg);

        const error = this.client.utils
            .embed()
            .setTitle('There was an error whilst generating your pride image!')
            .setColor(this.client.constants.Colours.Red)
            .setAuthor(msg.author.username, msg.author.avatarURL())
            .setThumbnail(msg.author.avatarURL());
        opacity = opacity / 100; // Convert from percentage to decimal

        // Ensure that the specified flag is valid
        if (!flags.includes(flag))
            return msg.channel.send(
                error.setDescription(
                    `The provided flag is not supported! Please select one of the following, or send newt a DM asking them to add your requested flag!\`\`\`${flags.join(
                        ', '
                    )}\`\`\``
                )
            );

        // If the opacity is greater than 100%
        if (opacity > 1 || opacity < 0)
            return msg.channel.send(
                error.setDescription(
                    'The provided opacity has to be between 0 and 100%!'
                )
            );

        // Work out whether we are working on an attachment or a profile picture
        const attachment = msg.attachments.first();
        const hasAttachment = msg.attachments.first() !== undefined;
        const type = hasAttachment ? 'attachment' : 'profile picture';

        // Request the image (stored in body)
        request(
            {
                url: hasAttachment
                    ? attachment.url
                    : msg.author.avatarURL({ size: 512, format: 'png' }),
                method: 'get',
                encoding: null
            },
            async (err, _res, body) => {
                // If there is a problem, report it
                if (err) {
                    error.setDescription(
                        `There was an issue with fetching your ${type}. Sorry! Please report this to newt if you would like further help.`
                    );

                    this.client.logger.error(
                        `pride: There was a problem fetching ${this.client.userLogCompiler(
                            msg.author
                        )}'s ${type}: ${err}`
                    );
                    return msg.channel.send(error);
                }

                // Create the new attachment and send it to the server!
                const attachment = this.client.utils.attachment(
                    await this.client.utils.pride(body, flag, opacity),
                    `${msg.author.username}.png`
                );
                msg.channel.send(attachment);
            }
        );

        this.client.logger.command(
            `${this.client.userLogCompiler(
                msg.author
            )} just requested that their ${type} has a ${flag} blitted over it at ${opacity} opacity.`
        );
    }
}

module.exports = Pride;
export default Pride;
