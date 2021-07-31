import * as Discord from 'discord.js';
import { PastebinClient } from '@catte_/pastebin.js';
import Constants, { Roles, Channels } from '../Constants';
import { PrismaClient } from '@prisma/client';
import { AliasStore } from '@sapphire/framework';
import TVFCommand from '../struct/TVFCommand';
import TVFUtils from '../struct/TVFUtils';

declare module '@sapphire/framework' {
	interface SapphireClient {
		production: boolean;
		server: Discord.Guild;
		pastebin: PastebinClient;
		botLogger: Logger;
		constants: typeof Constants;
		utils: TVFUtils;
		tvfRoles: ReturnType<typeof Roles>;
		tvfChannels: ReturnType<typeof Channels>;
		db: PrismaClient;
		prefix: string;
		botBanner: boolean;

		userLogCompiler(u: Discord.User): string;
	}

	interface Command {
		category: string;
	}

	interface CommandOptions {
		permissions?: Discord.PermissionResolvable[];
		cooldown?: number;
		general?: boolean;
	}
}
