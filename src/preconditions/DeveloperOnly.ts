import { newtId, preconditionMessages } from '~config';
import Precondition from '~handler/Precondition';

@Precondition.Config({
    name: 'DeveloperOnly'
})
export default class DeveloperOnly extends Precondition {
    public run(message: Precondition.Message): Precondition.Result {
        if (message.author.id !== newtId)
            this.error({ message: preconditionMessages.DeveloperOnly });
        else return this.ok();
    }
}
