import Listener from '~handler/Listener';
import { MessageAttachment, SelectMenuInteraction, TextChannel } from 'discord.js';
import { prideMenuId } from '~config';
import FormData from 'form-data';
import axios from 'axios';
import { choices } from '~commands/Social/Pride';

@Listener.Config({
    name: 'prideChoice',
    event: 'interactionCreate'
})
export default class PrideChoice extends Listener<'interactionCreate'> {
    private async generatePfp(type: typeof choices[keyof typeof choices], imageUrl: string) {
        const { data: image } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageType = imageUrl.split('.')[imageUrl.split('.').length - 1];

        const form = new FormData();
        form.append('file', image, 'pfp.png');

        const { data: rendered } = await axios.post(
            `https://api.pfp.lgbt/v5/image/static/circle/solid/${type}.${imageType}`,
            form,
            {
                headers: form.getHeaders(),
                responseType: 'arraybuffer'
            }
        );

        return rendered;
    }

    async run(interaction: SelectMenuInteraction) {
        if (!interaction.isSelectMenu() || interaction.customId !== prideMenuId) return;

        // Render the image and send it back
        const image = interaction.user.avatarURL({ format: 'png', size: 512 });
        const renderedImage = await this.generatePfp(interaction.values[0], image);
        const attachment = new MessageAttachment(renderedImage, 'pride.png');
        const channel = (await this.client.tvf.server.channels.fetch(
            interaction.channelId
        )) as TextChannel;
        const message = await channel.messages.fetch(interaction.message.id);

        await message.edit({
            content: 'Here is your new profile picture! (:',
            files: [attachment],
            components: []
        });
    }
}
