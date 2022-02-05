import { PrismaClient } from '@prisma/client';
import { SapphireClient } from '@sapphire/framework';

export default class Client extends SapphireClient {
    public db = new PrismaClient();
    public isProduction = process.env.NODE_ENV === 'production';

    constructor() {
        super({
            intents: [
                'GUILDS',
                'GUILD_MEMBERS',
                'GUILD_PRESENCES',
                'GUILD_BANS',
                'GUILD_MESSAGES',
                'GUILD_VOICE_STATES',
                'DIRECT_MESSAGES',
                'GUILD_MESSAGE_REACTIONS'
            ],
            presence: {
                status: 'idle'
            },
            defaultPrefix: process.env.NODE_ENV === 'production' ? 'tvf ' : 'tvf beta '
        });
    }
}
