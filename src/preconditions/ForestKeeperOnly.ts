import { preconditionMessages } from '~config';
import Precondition from '~handler/Precondition';

@Precondition.Config({
    name: 'ForestKeeperOnly'
})
export default class ForestKeeperOnly extends Precondition {
    public run(message: Precondition.Message): Precondition.Result {
        if (!this.client.tvf.roles.forestKeepers.members.has(message.author.id))
            this.error({ message: preconditionMessages.ForestKeeperOnly });
        else return this.ok();
    }
}
