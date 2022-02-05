import { discord } from '~config';
import Client from '~structures/Client';
import Logger from '~structures/Logger';

// Start the bot
const tvf = new Client();
const logger = new Logger(tvf);

tvf.login(discord.token).then(() => logger.info('Logged into Discord!'));
