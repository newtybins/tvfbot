import SubcommandCommand from '~handler/SubcommandCommand';

@SubcommandCommand.Config({
    name: 'private',
    description: undefined,
    subCommands: [{ input: 'request', default: true }, { input: 'start' }],
    args: {
        request: [
            {
                name: 'reason',
                required: true
            }
        ]
    }
})
export default class Private extends SubcommandCommand {
    public async request() {}
}
