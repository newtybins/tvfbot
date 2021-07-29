import * as Discord from 'discord.js';
import * as winston from 'winston';
import logdnaWinston from 'logdna-winston';
import { PastebinClient } from '@catte_/pastebin.js';
import moment from 'moment';
import si from 'systeminformation';
import { SapphireClient } from '@sapphire/framework';
import Constants from '../Constants';
import TVFRoles from '../TVFRoles';
import TVFChannels from '../TVFChannels';
import { PrismaClient } from '@prisma/client';

export default class TVFClient extends SapphireClient {
	production = process.env.NODE_ENV === 'production';
	botLogger: Logger;
	server: Discord.Guild;
	pastebin: PastebinClient;
	constants: typeof Constants;
	tvfRoles: ReturnType<typeof TVFRoles>;
    tvfChannels: ReturnType<typeof TVFChannels>;
	db: PrismaClient;
	botBanner = true;

	/**
	 * Initialises an instance of TVF Bot's client
	 * @param constants The constants for the bot to use
	 */
	constructor(constants: typeof Constants) {
		super({
			disableMentions: 'everyone', 
			ws: {
				intents: [ 
					'GUILDS', 
					'GUILD_MEMBERS',
					'GUILD_PRESENCES', 
					'GUILD_BANS', 
					'GUILD_MESSAGES', 
					'GUILD_VOICE_STATES', 
					'DIRECT_MESSAGES'
				]
			},
			presence: {
				activity: {
					name: 'out for you <3',
					type: 'WATCHING'
				},
				status: 'idle'
			},
			caseInsensitiveCommands: true,
			caseInsensitivePrefixes: true,
			defaultPrefix: process.env.NODE_ENV === 'production' ? 'tvf ' : 'tvf beta ',
			loadDefaultErrorEvents: false
		});

		this.constants = constants;
	}

	async start() {
		// Configure the logger's colour scheme
		winston.addColors({
			error: 'bold red',
			warn: 'bold yellow',
			info: 'bold cyan',
			debug: 'bold white',
			command: 'bold yellow',
			db: 'bold white',
		});

		// Create the logger
		const { ip4: ip, mac } = (await si.networkInterfaces())[0];

		const logger = winston.createLogger({
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(winston.format.printf(log => winston.format.colorize().colorize(log.level, `${moment().format(this.constants.moment)} - ${log.level}: ${log.message}`))),
				}),
				new logdnaWinston({
					key: process.env.LOGDNA,
					hostname: 'ayano',
					ip,
					mac,
					app: this.production ? 'ayano' : 'ayano-beta',
					env: this.production ? 'Production' : 'Development',
					level: 'info',
					indexMeta: true
				})
			],
			levels: {
				debug: 0,
				command: 1,
				db: 2,
				info: 3,
				warn: 4,
				error: 5,
			}
		}) as Logger;

		// Update class properties
		this.botLogger = logger;
		this.db = new PrismaClient();

		// Error events
		this.on('debug', (m) => this.botLogger.debug(m));
		this.on('warn', (m) => this.botLogger.warn(m));
		this.on('error', (m) => this.botLogger.error(m));
		process.on('uncaughtException', (m) => this.botLogger.error(m));

		// Log into pastebin
		this.pastebin = new PastebinClient(process.env.PASTEBIN_KEY, process.env.PASTEBIN_USERNAME, process.env.PASTEBIN_PASSWORD)
		await this.pastebin.login();
		this.botLogger.info('Logged into Pastebin!');

		// Log into discord
		await this.login(this.production ? process.env.STABLE : process.env.BETA);
		this.botLogger.info('Logged into Discord!');

		// Save the server for use in other methods
		this.server = this.guilds.cache.get('435894444101861408');
		this.botLogger.info('Saved server to Client!');
	}

	/**
     * A simple utility method to get a custom user log description
     * @param {Discord.User} u
     */
	userLogCompiler(u: Discord.User): string {
        return `${u.tag} (${u.id})`;
    }
}
