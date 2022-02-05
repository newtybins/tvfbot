import Command from '~handler/Command';
import Embed from '~structures/Embed';
import { stripIndents } from 'common-tags';

@Command.Config({
    name: 'ping',
    description: 'Checks if I am still alive <3'
})
export default class Ping extends Command {
    public async messageRun(message: Command.Message) {
        const embed = new Embed('normal', message.author)
            .setTitle('pong!')
            .setDescription('Calculating ping...');

        const sentMessage = await message.channel.send({ embeds: [embed] });

        const ping = sentMessage.createdTimestamp - message.createdTimestamp;

        embed.setDescription(stripIndents`
			Bot Latency: ${ping}ms
			API Latency: ${this.client.ws.ping}ms
		`);

        await sentMessage.edit({ embeds: [embed] });
    }
}
