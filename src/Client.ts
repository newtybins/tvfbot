import * as Discord from 'discord.js';
import * as winston from 'winston';
import * as fs from 'fs';
import mongoose = require('mongoose');
import { KSoftClient, Image } from 'ksoft.js';
import * as jimp from 'jimp';
import * as path from 'path';

import User, { IUser } from './models/user';
import { IRoles } from './constants/Roles';
import Colours from './constants/Colours';
import { IChannels } from './constants/Channels';
import { IEmojis } from './constants/Emojis';
import Compliments from './constants/Compliments';

export default class Client {
  // properties
  isProduction = process.env.NODE_ENV === 'production';
  bot: Discord.Client;
  logger: winston.Logger;
  commands: Discord.Collection<string, Command> = new Discord.Collection();
  events: Discord.Collection<string, any> = new Discord.Collection();
  ksoft: KSoftClient;
  server: Discord.Guild
  config: BotConfig = {
    botbanner: true,
  };

  // constants
  moment = 'ddd, MMM Do, YYYY h:mm A';
  blankField: Discord.EmbedFieldData = { name: '\u200B', value: '\u200B' };
  invite = 'https://discord.gg/RS69ssj';
  banAppeal = 'https://forms.gle/EoUp6hxmNvuAJXJfA';
  prefix = this.isProduction ? 'tvf ': 'tvf beta ';
  privateTimeout = 21600000;

  developers = [
    '326767126406889473', // newt main
    '625919227651555348' // newt alt
  ];

  embedLimit = {
    title: 256,
    description: 2048,
    footer: 2048,
    author: 256,
    field: {
      title: 256,
      value: 1024
    }
  }

  roles: IRoles;
  colours = Colours;
  channels: IChannels;
  emojis: IEmojis;
  compliments = Compliments;

  auth = {
    discord: this.isProduction ? process.env.STABLE : process.env.BETA,
    mongo: process.env.MONGO,
    ksoft: process.env.KSOFT,
    logdna: process.env.LOGDNA,
  }

  db = {
    user: User,
  }

  // constructor
  constructor() {
    // create the logger
    winston.addColors({
      error: 'bold red',
      warn: 'bold yellow',
      info: 'bold cyan',
      debug: 'bold white',
    });

    const timestamp = winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm '});

    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(timestamp, this.isProduction ?
            winston.format.printf(log => `${log.timestamp} - ${log.level}: ${log.message}`) :
            winston.format.printf(log => winston.format.colorize().colorize(log.level, `${log.timestamp} - ${log.level}: ${log.message}`))
          ),
        })
      ]
    });

    const winstonError = {
      apply: (target: any, _: any, argumentsList: any[]) => {
        if (
          argumentsList.length >= 2 ||
                  argumentsList.length <= 0 ||
                  typeof argumentsList[0] === 'string' ||
                  argumentsList[0] instanceof String
        ) {
          target.apply(logger, argumentsList);
        }
        else {
          const error = argumentsList[0];
          target.apply(logger, ['', error]);
        }
      },
    };

    logger.debug = new Proxy(logger.debug, winstonError);
    logger.error = new Proxy(logger.error, winstonError);

    // set properties
    this.bot = new Discord.Client();
    this.ksoft = new KSoftClient(this.auth.ksoft);
    this.logger = logger;
    logger.info('Discord client, KSoft client, and logger are all initialised');
  }

  // start the bot
  async start() {
    // connect to the database
    mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // get all of the files in the event folder and command folders
    const eventFiles = fs.readdirSync(`${__dirname}/events/`).filter(f => f.endsWith('.js'));
    const categories = fs.readdirSync(`${__dirname}/commands/`).filter(f => !f.endsWith('.js'));

    categories.forEach(category => {
      const files = fs.readdirSync(`${__dirname}/commands/${category}/`).filter(f => f.endsWith('.js'));

      for (const file of files) {
          let { default: command }: { default: Command } = require(`./commands/${category}/${file}`);
          command.category = category;
          this.commands.set(command.name, command);
          this.logger.info(`"${command.name}" command loaded from the "${command.category}" category!`);
      }
    });

    // events

    // error events
    this.bot.on('debug', m => this.logger.debug(m));
    this.bot.on('warn', m => this.logger.warn(m));
    this.bot.on('error', m => this.logger.error(m));
    process.on('uncaughtException', m => this.logger.error(m));

    // discord events
    for (const file of eventFiles) {
      // get the event file and add it to the collection
      const name = file.substring(0, file.length - 3);
      const { default: event } = require(`./events/${file}`);
      this.events.set(name, event);

      // load the event
      // @ts-ignore
      this.bot.on(name, (...args: any[]) => event(this, ...args));

      // log that the event has been loaded
      this.logger.info(`${name} event loaded.`);
    }

    // database events
    mongoose.connection
      .on('connected', () => this.logger.info('Connected to database!'))
      .on('error', err => this.logger.error(`The database has thrown an error - ${err}`))
      .on('disconnect', () => this.logger.info('Disconnected from the database.'));

    // log into discord
    await this.bot.login(this.auth.discord);

    // save the server for use in other methods
    this.server = this.bot.guilds.cache.get('435894444101861408');
  }

  // create an embed
  createEmbed(options: {
    colour?: string, // input hexadecimal
    timestamp?: boolean, // if false, the timestamp is omitted
    thumbnail?: boolean, // if false, the thumbnail is omitted
    author?: boolean, // if true, the author gets automatically set to the author of the message
  } = {
    colour: this.colours.white,
    timestamp: false,
    thumbnail: true,
    author: false,
  }, msg?: Discord.Message): Discord.MessageEmbed {
    // create an embed and configure it accordinly
    const embed = new Discord.MessageEmbed()
      .setColor(options.colour || this.colours.green);

    if (options.timestamp) embed.setTimestamp();
    if (options.thumbnail) embed.setThumbnail(this.server.iconURL());
    if (msg && options.author) embed.setAuthor(msg.author.tag, msg.author.avatarURL());

    return embed;
  }

  // format an emoji message
  emojiMessage(emoji: string, msg: string) {
    return `**${emoji}  |** ${msg}`;
  }

  // checks if a member has a staff role
  isUser(role: StaffRole | 'Staff', user: Discord.User): boolean {
    const member = this.server.member(user);
    return role === 'Support' ? member.roles.cache.has(this.roles.staff.support.id) || member.roles.cache.has(this.roles.staff.heads.support.id) :
           role === 'Tech' ? member.roles.cache.has(this.roles.staff.tech.id) || member.roles.cache.has(this.roles.staff.heads.tech.id) :
           role === 'Engagement' ? member.roles.cache.has(this.roles.staff.engagement.id) || member.roles.cache.has(this.roles.staff.heads.engagement.id) :
           role === 'Moderation' ? member.roles.cache.has(this.roles.staff.moderators.id) || member.roles.cache.has(this.roles.staff.heads.moderators.id) :
           role === 'Admin' ? member.roles.cache.has(this.roles.staff.admins.id) :
           role === 'Staff' ? member.roles.cache.has(this.roles.staff.support.id) || member.roles.cache.has(this.roles.staff.heads.support.id) || member.roles.cache.has(this.roles.staff.tech.id) || member.roles.cache.has(this.roles.staff.heads.tech.id) || member.roles.cache.has(this.roles.staff.engagement.id) || member.roles.cache.has(this.roles.staff.heads.engagement.id) || member.roles.cache.has(this.roles.staff.moderators.id) || member.roles.cache.has(this.roles.staff.heads.moderators.id) || member.roles.cache.has(this.roles.staff.admins.id)
           : false;
  }

  // find a member in a message
  checkForMember(msg: Discord.Message, args: string[]): Discord.GuildMember {
    return msg.mentions.members.first() === undefined ?
      msg.guild.members.cache.find(({ user }) => user.tag === args.join(' ')) :
      msg.mentions.members.first();
  }

  // returns a user's document from the database
  async userDoc(id: string): Promise<IUser> {
    return await User.findOne({ id }, (err, doc) => err ? this.logger.error(err) : doc);
  }

  // converts a list of permissions to friendly names
  friendlyPermissions(perms: Readonly<Discord.Permissions>): string[] {
    const list = perms.toArray();

    const friendly = {
      CREATE_INSTANT_INVITE: 'Create Instant Invite',
      STREAM: 'Stream',
      KICK_MEMBERS: 'Kick Members',
      BAN_MEMBERS: 'Ban Members',
      ADMINISTRATOR: 'Administrator',
      MANAGE_CHANNELS: 'Manage Channels',
      MANAGE_GUILD: 'Manage Guild',
      ADD_REACTIONS: 'Add Reactions',
      VIEW_AUDIT_LOG: 'View Audit Log',
      PRIORITY_SPEAKER: 'Priority Speaker',
      VIEW_CHANNEL: 'View Channel',
      READ_MESSAGES: 'Read Messages',
      SEND_MESSAGES: 'Send Messages',
      SEND_TTS_MESSAGES: 'Send TTS Messages',
      MANAGE_MESSAGES: 'Manage Messages',
      EMBED_LINKS: 'Embed Links',
      ATTACH_FILES: 'Attach Files',
      READ_MESSAGE_HISTORY: 'Read Message History',
      MENTION_EVERYONE: 'Mention Everyone',
      EXTERNAL_EMOJIS: 'External Emojis',
      USE_EXTERNAL_EMOJIS: 'Use External Emojis',
      CONNECT: 'Connect',
      SPEAK: 'Speak',
      MUTE_MEMBERS: 'Mute Members',
      DEAFEN_MEMBERS: 'Deafen Members',
      MOVE_MEMBERS: 'Move Members',
      USE_VAD: 'Use Voice Activity',
      CHANGE_NICKNAME: 'Change Nickname',
      MANAGE_NICKNAMES: 'Manage Nicknames',
      MANAGE_ROLES: 'Manage Roles',
      MANAGE_ROLES_OR_PERMISSIONS: 'Manage Roles',
      MANAGE_WEBHOOKS: 'Manage Webhooks',
      MANAGE_EMOJIS: 'Manage Emojis'
    }

    let newList: string[] = [];

    for (let perm of list) {
      newList.push(friendly[perm]);
    }

    return newList;
  }

  // save a document
  saveDoc(doc: mongoose.Document) {
    doc.save().catch(err => this.logger.error(`There was an error saving that document: ${err}`));
  }

  // generate a pride image
  async pridePfp(user: Discord.User, type: string, opacity: number): Promise<Buffer> {
    // load the necessary images
    const image = await jimp.read(user.avatarURL({ size: 512, format: 'png' }));
    const flag = await jimp.read(path.resolve(`assets/pride/${type}.png`));

    // resize the flag and set opacity to 50%
    flag.resize(image.getWidth(), image.getHeight());
    flag.opacity(opacity);

    // overlay the flag onto the image
    image.blit(flag, 0, 0);

    // return the manipulated image's buffer
    return await image.getBufferAsync(jimp.MIME_PNG);
  }

  // extension of the <Client>.ksoft.images.random function
  async randomImage(term: string, gif: boolean = true): Promise<Image> {
    let img = await this.ksoft.images.random(term, { nsfw: false });

    do {
      img = await this.ksoft.images.random(term, { nsfw: false });
    } while (gif ? !(/.jpg|.jpeg|.png|.webp|.gif/.test(img.url)) : !(/.jpg|.jpeg|.png|.webp/.test(img.url)))

    return img;
  }

  // formats a number
  formatNumber(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
