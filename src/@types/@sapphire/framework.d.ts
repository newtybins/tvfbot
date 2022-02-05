import type { PrismaClient } from '@prisma/client';
import type { Message } from 'discord.js';
import type Embed from '~structures/Embed';

declare module '@sapphire/framework' {
    interface SapphireClient {
        db: PrismaClient;
        isProduction: boolean;
    }

    interface Command {
        generateHelpEmbed(message: Message): Embed;
    }
}
