import { stripIndents } from 'common-tags';
import { GuildMember, Message } from 'discord.js';
import { hour, tick, timeouts } from '~config';
import SubcommandCommand from '~handler/SubcommandCommand';
import Embed from '~structures/Embed';
import { timeout } from 'timeout';
import { toWords as numberToWords } from 'number-to-words';

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
    private async reject(
        message: SubcommandCommand.Message,
        description: string,
        prefix: string,
        subcommand?: string
    ) {
        const embed = new Embed('error').setDescription(description);

        const usage = this.generateUsage(message.member).find(s =>
            !subcommand ? s.default : s.subcommand === subcommand
        ).usage;

        if (usage) embed.addField('Usage', `\`\`\`${prefix}${usage}\`\`\``);

        const sentMessage = await message.reply({
            embeds: [embed]
        });

        await message.delete();
        return this.client.utils.deleteMessageAfter(sentMessage);
    }

    private async hasSession(member: GuildMember): Promise<boolean> {
        const session = await this.client.db.privateVent.findUnique({
            where: { userId: member.id }
        });

        if (session) return true;
        else return false;
    }

    private async announceSupport(
        embed: Embed,
        hasPing: boolean = false,
        content?: string
    ): Promise<Message> {
        return this.client.tvf.channels.staff.support.send({
            content: `${
                hasPing && this.client.production
                    ? `${this.client.tvf.roles.staff.support.toString()} `
                    : ''
            }${content ?? hasPing == true ? `, ${content}` : content}`,
            embeds: [embed]
        });
    }

    private isSupport(member: GuildMember) {
        return (
            member.roles.cache.has(this.client.tvf.roles.staff.support.id) ||
            member.roles.cache.has(this.client.tvf.roles.staff.heads.support.id)
        );
    }

    // todo: replace all references of reason with topic
    /**
     * Request a private venting session
     */
    public async request(
        message: SubcommandCommand.Message,
        args: SubcommandCommand.Args,
        context: SubcommandCommand.Context
    ) {
        // Reject the user if they already have a private venting session requested
        if (await this.hasSession(message.member)) {
            return await this.reject(
                message,
                'You already have a private venting session',
                context.commandPrefix
            );
        }

        const { value: reason } = await args.restResult('string');

        // Reject the user on the grounds of no reason
        if (!reason) {
            return await this.reject(
                message,
                'You must provide a reason for your private vent!',
                context.commandPrefix
            );
        }

        // Generate an ID for the private venting session and save the relevant data to the document
        const { id: friendlyId } = this.client.utils;

        await this.client.db.privateVent.create({
            data: { userId: message.author.id, friendlyId, reason }
        });

        // Setup all of the timeouts and the expiry countdown
        const alertEmbed = new Embed('normal', message.member)
            .setThumbnail(message.member.avatarURL())
            .setDescription(
                `Feel free to run \`${context.commandPrefix}start ${friendlyId}\` to begin the session (:`
            )
            .addField('Reason', reason);

        for (let i = 1; i <= timeouts.privateHours; i++) {
            timeout(`${friendlyId}+${i}`, i * hour, () => {
                this.announceSupport(
                    alertEmbed.setTitle(
                        `${
                            message.member.displayName
                        }'s private venting session will expire in ${numberToWords(
                            timeouts.privateHours - i
                        )} hour${timeouts.privateHours - i === 1 ? '' : 's'}!`
                    ),
                    false
                );
            });
        }

        timeout(`${friendlyId}+6`, timeouts.privateHours * hour, async () => {
            // Cancel the private venting session
            await this.client.db.privateVent.delete({ where: { userId: message.author.id } });

            // Inform the support team that the session has expired
            await this.announceSupport(
                new Embed('error', message.member)
                    .setTitle(`${message.member.displayName}'s venting session has expired!`)
                    .setThumbnail(message.member.avatarURL()),
                true
            );

            // Inform the user that their session has expired
            try {
                message.author.send({
                    embeds: [
                        new Embed('error', message.member).setTitle(
                            'Your private venting session has expired!'
                        ).setDescription(stripIndents`
                We're sorry we couldn't get to your private venting session in time ):
                We automatically cancel old private venting sessions so that users can request new ones if they still need help, and to unclog the system!
                If you would still like some help, please do not be scared to request a new session! Thanks! (:
            `)
                    ]
                });
            } catch (e) {}
        });

        // Alert the support team of the request
        await this.announceSupport(
            new Embed('normal', message.member)
                .setThumbnail(message.member.avatarURL())
                .setTitle('New private venting session requested!')
                .setDescription(
                    `Feel free to run \`${context.commandPrefix}start ${friendlyId}\` to begin the session (:`
                )
                .addField('Reason', reason),
            true
        );

        // Alert the user that their request was successful
        try {
            await message.delete();

            return message.author.send({
                embeds: [
                    new Embed('success', message.member)
                        .setTitle('Your private venting session has been requested')
                        .setDescription(
                            stripIndents`
                Your session may begin quickly, or it may take some time - it depends on how busy we are, how many staff are available, and whether any staff are comfortable with taking it.
                Please remain online until your session begins. You\'ll recieve a ping from the server when we\'re ready for you. A few things to note before we start...
            `
                        )
                        .addField(
                            'Our staff are not councellors or medical professionals',
                            'They can not offer you medical or deep life advice.'
                        )
                        .addField(
                            'Who can view your session',
                            stripIndents`
                Your session may only be viewed by the Support Team and the Administrators. Private Venting sessions are 100% confidential, and staff are not allowed to share the contents elsewhere.
                They are only permitted to do so if it is determined that you or another person are at serious risk, or if you disclose something illegal or TOS-breaking.
            `
                        )
                        .addField(
                            'The right to transfer',
                            'Staff reserve the right to transfer your session over to another member of staff for any given reason during your session.'
                        )
                ]
            });
        } catch {
            await message.react(tick);
            return this.client.utils.deleteMessageAfter(message);
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

    // Default behaviour
    public async messageRun(
        message: SubcommandCommand.Message,
        args: SubcommandCommand.Args,
        context: SubcommandCommand.Context
    ) {
        return this.request(message, args, context);
    }
}