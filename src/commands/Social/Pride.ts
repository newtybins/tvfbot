import Command from '~handler/Command';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { prideMenuId } from '~config';

export const choices = {
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
    Xenogender: 'xenogender'
};

@Command.Config({
    name: 'pride',
    description: 'Show your pride with a new profile picture!'
})
export default class Pride extends Command {
    public async messageRun(message: Command.Message) {
        // Send a context menu offering different options
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(prideMenuId)
                .setPlaceholder('<3')
                .addOptions(
                    Object.keys(choices).map(key => {
                        return {
                            label: key,
                            value: choices[key]
                        };
                    })
                )
        );

        await message.reply({
            content: 'Please select an overlay from below (:',
            components: [row]
        });
    }
}
