import { TextChannel } from 'discord.js';
import { newtId, preconditionMessages } from '~config';
import Precondition from '~handler/Precondition';

@Precondition.Config({
    name: 'BotCommandsOnly'
})
export default class BotCommandsOnly extends Precondition {
    public run(message: Precondition.Message, command: Precondition.Command): Precondition.Result {
        // If the channel is not bot commands, and...
        // If the command run was not a venting command in a venting channel, and ...
        // If the command was not run in the testing channel, and ...
        // If the command was not run by newt
        if (
            message.channel !== this.client.tvf.channels.botCommands &&
            !(
                command.category?.toLowerCase() === 'venting' &&
                this.client.tvf.channels.ventingChannels.includes(message.channel as TextChannel)
            ) &&
            message.channel !== this.client.tvf.channels.testing &&
            message.author.id !== newtId
        )
            this.error({ message: preconditionMessages.BotCommandsOnly });
        else return this.ok();
    }
}
