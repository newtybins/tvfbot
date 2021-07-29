import * as Discord from 'discord.js';
import * as winston from 'winston';

declare global {
  type MessageContent = Discord.APIMessageContentResolvable | (Discord.MessageOptions & { split?: false }) | Discord.MessageAdditions;
  type Channels = Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;
  type StaffRole = 'Support' | 'Moderation' | 'Admin' | 'Staff';
  type LogType = 'user' | 'guild' | 'channel';
  type Optional<T> = {
		[P in keyof T]?: T[P];
	}
  type Modify<T, R> = Omit<T, keyof R> & R;

  interface Logger extends winston.Logger {
    command: winston.LeveledLogMethod;
    db: winston.LeveledLogMethod;
  }

  interface LevelReward {
    level: number;
    roleID: string;
    name: string;
  }
}
