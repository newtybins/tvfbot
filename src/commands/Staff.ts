import { stripIndents } from 'common-tags';
import type { GuildMember, Role } from 'discord.js';
import Command from '~handler/Command';
import Embed from '~structures/Embed';

interface RoleResult {
    members: GuildMember[];
    online: number;
    size: number;
}

@Command.Config({
    name: 'staff',
    description: 'Meet our lovely staff!'
})
export default class Staff extends Command {
    private countOnline(...members: GuildMember[][]) {
        const flattenedList = members.flat();
        let online = 0;

        flattenedList.forEach(member => {
            if (member?.presence && member?.presence?.status !== 'offline') online++;
        });

        return online;
    }

    private getRoleStats(mainRole: Role): RoleResult {
        let members = [...mainRole.members.values()];

        return {
            members,
            online: this.countOnline(members),
            size: members.length
        };
    }

    private get forestKeepers(): RoleResult {
        return this.getRoleStats(this.client.tvf.roles.forestKeepers);
    }

    private get totalOnline(): number {
        return this.countOnline([...this.client.tvf.roles.staff.members.values()]);
    }

    private get totalStaff(): number {
        return this.client.tvf.roles.staff.members.size;
    }

    public async messageRun(message: Command.Message) {
        return await message.reply({
            embeds: [
                new Embed('normal', this.client.tvf.newt)
                    .setTitle('Meet our Staff!')
                    .setThumbnail(this.client.tvf.server.iconURL())
                    .setDescription(
                        `**${this.totalOnline}** of our **${this.totalStaff}** lovely members of staff are currently online!`
                    )
                    .addField(
                        `Forest Keepers (${this.forestKeepers.online}/${this.forestKeepers.size})`,
                        stripIndents`
        **Members**
        ${this.forestKeepers.members.join('\n')}
    `,
                        true
                    )
            ]
        });
    }
}
