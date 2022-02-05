import type { PrismaClient } from '@prisma/client';
import type { Message } from 'discord.js';
import Utils from '~utils';
import Client from '~structures/Client';
import type Embed from '~structures/Embed';

declare module '@sapphire/framework' {
    interface SapphireClient {
        db: PrismaClient;
        production: boolean;
        tvf: Client.TVF;
        utils: Utils;
    }

    interface Command {
        generateHelpEmbed(message: Message, context: Command.RunContext): Embed;
    }
}
