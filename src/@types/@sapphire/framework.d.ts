import { PrismaClient } from '@prisma/client';

declare module '@sapphire/framework' {
    interface SapphireClient {
        db: PrismaClient;
        isProduction: boolean;
    }
}
