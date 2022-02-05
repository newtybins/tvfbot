import type { PrismaClient } from '@prisma/client';
import type { Message } from 'discord.js';
import Client from '~structures/Client';
import type Embed from '~structures/Embed';

declare module '@sapphire/framework' {
    interface SapphireClient {
        db: PrismaClient;
        isProduction: boolean;
        tvf: Client.TVF;
    }

    interface Command {
        generateHelpEmbed(message: Message): Embed;
    }
}
