import type { Message } from 'discord.js';
import { timeouts, tvfColour } from '~config';
import emitters from '~emitters';
import Listener from '~handler/Listener';
import Embed from '~structures/Embed';

@Listener.Config({
    name: 'Helper Ping',
    event: Listener.Events.MessageCreate,
    production: true
})
export default class HelperPing extends Listener<typeof Listener.Events.MessageCreate> {
    public async run(message: Message) {
        if (message.content.includes(this.client.tvf.roles.helper.toString())) {
            const helperEmbed = new Embed()
                .setColor(tvfColour)
                .setThumbnail(this.client.tvf.server.iconURL())
                .setTitle(`${message.author.username} needs help!`)
                .setDescription(`[Jump to the message.](${message.url})`)
                .addField('Where?', message.channel.toString())
                .addField('Message', message.content)
                .setTimestamp(new Date());

            this.client.tvf.channels.helpers.send({ embeds: [helperEmbed] });

            message.channel.send(
                `${message.author} - please wait, a helper will arrive shortly. If it's an emergency, call the relevant number in ${this.client.tvf.channels.resources}.`
            );
        }
    }
}
