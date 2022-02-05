import { GuildMember } from 'discord.js';
import { EventEmitter } from 'tsee';

export default new EventEmitter<{
    getXp: (member: GuildMember) => void;
    levelUp: (member: GuildMember, newLevel: number) => void;
}>();
