import { breathingGif } from '~config';
import Command from '~handler/Command';
import Embed from '~structures/Embed';

@Command.Config({
    name: 'breathe',
    aliases: ['breathing'],
    description: 'Deep breaths, everything is going to be alright <3'
})
export default class Breathe extends Command {
    // todo: more splash texts
    private splashTexts: string[] = ['Hey, hey...', 'We are here for you (:'];

    private get splashText() {
        return this.splashTexts[Math.floor(Math.random() * this.splashTexts.length)];
    }

    public async messageRun(message: Command.Message, args: Command.Args) {
        return await message.reply({
            embeds: [
                new Embed()
                    .setTitle(this.splashText)
                    .setDescription(
                        'Lets take some deep breaths, everything is going to be alright <3'
                    )
                    .setImage(breathingGif)
                    .setThumbnail(this.client.user.avatarURL())
            ]
        });
    }
}
