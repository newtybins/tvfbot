import { Listener } from 'discord-akairo';
import TVFRoles from '../TVFRoles';
import TVFChannels from '../TVFChannels';
import moment from 'moment';
import PrivateRequest from '../commands/Venting/PrivateRequest';
import TVFClient from '../struct/TVFClient';

class Ready extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        // Load constants
        this.client.tvfRoles = TVFRoles(this.client.server);
        this.client.tvfChannels = TVFChannels(this.client as TVFClient);

        if (!this.client.production) {
            // Ensure all documents exist
            const members = await this.client.server.members.fetch();

            members.forEach(async (member) => {
                if (!member.user.bot) {
                    const user = await this.client.db.user.findUnique({
                        where: { id: member.id }
                    });

                    if (!user) {
                        await this.client.db.user.create({
                            data: { id: member.id }
                        });
                        this.client.logger.db(
                            `Made ${this.client.userLogCompiler(
                                member.user
                            )} a document!`
                        );
                    }
                }
            });

            // Ensure all private vents are ticking
            const vents = await this.client.db.private.findMany();
            vents.forEach(async (v) => {
                const expiresAt = moment(v.requestedAt).add(
                    this.client.constants.privateTimeout,
                    'ms'
                );
                const ms = expiresAt.diff(moment(), 'ms');
                const owner = await this.client.db.user.findUnique({
                    where: { privateID: v.id }
                });
                const user = this.client.users.cache.get(owner.id);

                if (!v.startedAt) {
                    PrivateRequest.prototype.privateTimeouts(
                        v,
                        user,
                        ms,
                        this.client as TVFClient
                    );
                    this.client.logger.db(
                        `Loaded Vent ${
                            v.id
                        } for User ${this.client.userLogCompiler(user)}!`
                    );
                }
            });
        }

        this.client.logger.info('TVF Bot is ready!');
    }
}

module.exports = Ready;
