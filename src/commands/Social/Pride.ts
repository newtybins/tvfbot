import Command from '~handler/Command';
import {
    Message,
    MessageActionRow,
    MessageAttachment,
    MessageSelectMenu,
    SelectMenuInteraction
} from 'discord.js';
import { prideMenuId } from '~config';
import FormData from 'form-data';
import axios from 'axios';

const choices = {
    Pride: 'pride',
    Agender: 'agender',
    Aromantic: 'aromantic',
    Asexual: 'ace',
    Bisexual: 'bi',
    Abrosexual: 'abrosexual',
    Bigender: 'bigender',
    Demiboy: 'demiboy',
    Demigirl: 'demigirl',
    Demisexual: 'demisexual',
    Demiromantic: 'demiromantic',
    Genderfluid: 'genderfluid',
    Genderflux: 'genderflux',
    Genderqueer: 'genderqueer',
    Grayromantic: 'grayromantic',
    Graysexual: 'graysexual',
    Intersex: 'intersex',
    Lesbian: 'lesbian',
    'Non-binary': 'nb',
    Omnisexual: 'omnisexual',
    Pansexual: 'pan',
    Polysexual: 'polysexual',
    Polyamorous: 'poly',
    Transgender: 'trans',
    Xenogender: 'xenogender',
    MLM: 'newmlm',
    Unlabeled: 'unlabeled',
    WLW: 'wlw',
    Queer: 'queer',
    NBLM: 'nblm'
} as const;

const styles = ['gradient', 'solid', 'dashed', 'overlay'] as const;

type Flag = typeof choices[keyof typeof choices];
type Style = typeof styles[number];

@Command.Config({
    name: 'pride',
    description: 'Show your pride with a new profile picture!',
    args: [
        {
            name: 'style',
            required: false,
            options: styles as unknown as string[]
        },
        {
            name: 'transparency',
            required: false
        }
    ]
})
export default class Pride extends Command {
    private scaleTransparency(transparency: number): number {
        return Math.floor((255 * transparency) / 100);
    }

    private async generatePfp(
        flag: Flag,
        imageUrl: string,
        format: string,
        style: Style,
        transparency: number = 100
    ) {
        const { data: image } = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        const form = new FormData();
        form.append('file', image, `pfp.${format}`);
        form.append('alpha', this.scaleTransparency(transparency));

        const { data: rendered } = await axios.post(
            `https://api.pfp.lgbt/v5/image/static/${style === 'overlay' ? 'overlay' : 'circle'}/${
                style === 'overlay' ? 'solid' : style
            }/${flag}.png`,
            form,
            {
                headers: form.getHeaders(),
                responseType: 'arraybuffer'
            }
        );

        return rendered;
    }

    public async messageRun(message: Command.Message, args: Command.Args) {
        let response: Message;
        let style: Style = (args.next()?.toLowerCase() as Style) ?? 'solid';
        let transparency: number = parseInt(args.next());

        if (style && !transparency && !isNaN(style as any)) {
            transparency = parseInt(style);
            style = 'solid';
        } else if (!transparency || isNaN(transparency))
            transparency = style === 'overlay' ? 50 : 100;

        this.client.once('interactionCreate', async (interaction: SelectMenuInteraction) => {
            if (!interaction.isSelectMenu() || interaction.customId !== prideMenuId) return;
            const [flag] = interaction.values;

            const image = message.author.avatarURL({ size: 512, dynamic: true, format: 'png' });
            const [format] = image.split('.')[image.split('.').length - 1].split('?');
            const renderedImage = await this.generatePfp(
                flag as Flag,
                image,
                format,
                style,
                transparency
            );
            const attachment = new MessageAttachment(renderedImage, `pride.${format}`);

            await response.edit({
                content: 'Here is your new profile picture! (:',
                files: [attachment],
                components: []
            });
        });

        // Send a context menu offering different options
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(prideMenuId)
                .setPlaceholder('<3')
                .addOptions(
                    Object.keys(choices)
                        .sort()
                        .map(key => {
                            return {
                                label: key,
                                value: choices[key]
                            };
                        })
                )
        );

        response = await message.reply({
            content: 'Please select a flag from below! (:',
            components: [row]
        });
    }
}
