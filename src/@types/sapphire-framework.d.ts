import * as Discord from 'discord.js';
import { PastebinClient } from '@catte_/pastebin.js';
import TVFConstants from '../Constants';
import TVFRoles from '../TVFRoles';
import TVFChannels from '../TVFChannels';
import { PrismaClient } from '@prisma/client';
import { ILogger } from '@sapphire/framework';

declare module '@sapphire/framework' {
	interface SapphireClient {
		production: boolean;
		server: Discord.Guild;
		pastebin: PastebinClient;
		botLogger: Logger;
		constants: typeof TVFConstants;
		tvfRoles: ReturnType<typeof TVFRoles>;
		tvfChannels: ReturnType<typeof TVFChannels>;
		db: PrismaClient;
		prefix: string;
		botBanner: boolean;

		userLogCompiler(u: Discord.User): string;
	}
}
