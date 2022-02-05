import { GuildMember } from 'discord.js';
import SubcommandCommand from '~handler/SubcommandCommand';

const restrictedTo = ['761713326597865483'];

@SubcommandCommand.Config({
    name: 'private',
    description: undefined,
    subcommands: [
        {
            name: 'request',
            description: 'Request a private venting session!',
            default: true,
            args: [
                {
                    name: 'reason',
                    required: true
                }
            ]
        },
        {
            name: 'cancel',
            description: 'Cancel your private venting session!'
        },
        {
            name: 'start',
            description: 'Start a private venting session! [support only]',
            args: [
                {
                    name: 'id',
                    required: true
                }
            ],
            restrictedTo
        },
        {
            name: 'end',
            description: 'End a private venting session! [support only]',
            args: [
                {
                    name: 'id',
                    required: true
                }
            ],
            restrictedTo
        }
    ]
})
export default class Private extends SubcommandCommand {
    private isSupport(member: GuildMember) {
        return (
            member.roles.cache.has(this.client.tvf.roles.staff.support.id) ||
            member.roles.cache.has(this.client.tvf.roles.staff.heads.support.id)
        );
    }

    /**
     * Request a private venting session
     */
    public async request(message: SubcommandCommand.Message, args: SubcommandCommand.Args) {
        const { value: reason } = await args.restResult('string');

        if (!reason) {
        }
    }

    /**
     * todo: Cancel a private venting session
     */
    public async cancel(message: SubcommandCommand.Message) {}

    /**
     * todo: Start a private venting session
     */
    public async start(message: SubcommandCommand.Message, args: SubcommandCommand.Args) {}

    /**
     * todo: End a private venting session
     */
    public async end(message: SubcommandCommand.Message, args: SubcommandCommand.Args) {}
}
