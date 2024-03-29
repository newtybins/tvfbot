import { stripIndents } from 'common-tags';
import TVFCommand from '../struct/TVFCommand';
import { Message } from 'discord.js';

class Ping extends TVFCommand {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'Core',
            description: 'Checks the latency between me and Discord!',
        });

        this.usage = 'ping';
        this.examples = ['ping'];
    }

    exec(msg: Message) {
        const embed = this.client.utils
            .embed()
            .setTitle('pong <3')
            .setColor(this.client.constants.Colours.Green)
            .setThumbnail(msg.guild.iconURL())
            .setAuthor(msg.author.username, msg.author.avatarURL())
            .setDescription('Calculating ping...');

        msg.channel.send(embed).then((resultMsg) => {
            const ping = resultMsg.createdTimestamp - msg.createdTimestamp;
            embed.setDescription(stripIndents`
                Bot Latency: ${ping}ms
                API Latency: ${this.client.ws.ping}ms
            `);
            resultMsg.edit(embed);
        });
    }
}

module.exports = Ping;
export default Ping;
