import { newtId } from '~config';
import Precondition from '~handler/Precondition';

@Precondition.Config({
    name: 'DeveloperOnly'
})
export default class DeveloperOnly extends Precondition {
    public run(message: Precondition.Message): Precondition.Result {
        if (message.author.id !== newtId)
            this.error({ message: 'You are not the developer of this bot!' });
        else return this.ok();
    }
}
