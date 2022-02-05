import { stripIndents } from 'common-tags';
import type { GuildMember, Role } from 'discord.js';
import Command from '~handler/Command';
import Embed from '~structures/Embed';

interface RoleResult {
    heads?: GuildMember[];
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

    private getRoleStats(mainRole: Role, headsRole?: Role, toFilter?: Role[]): RoleResult {
        let members = [...mainRole.members.values()];
        const heads = headsRole ? [...headsRole?.members.values()] : null;

        if (heads) members = members.filter(member => !heads.includes(member));

        if (toFilter?.length > 0) {
            toFilter.forEach(role => {
                const membersToFilter = [...role.members.values()];
                members = members.filter(member => !membersToFilter.includes(member));
            });
        }

        return {
            heads,
            members,
            online: this.countOnline(members, heads),
            size: members.length + (heads?.length ?? 0)
        };
    }

    private get administrators(): RoleResult {
        const { members, online, size } = this.getRoleStats(this.client.tvf.roles.staff.admins);
        const { ownerId } = this.client.tvf.server;

        return {
            heads: members.filter(member => member.id === ownerId),
            members: members.filter(member => member.id !== ownerId),
            online,
            size
        };
    }

    private get forestKeepers(): RoleResult {
        return this.getRoleStats(
            this.client.tvf.roles.staff.forestKeepers,
            this.client.tvf.roles.staff.heads.forestKeepers,
            [this.client.tvf.roles.staff.admins]
        );
    }

    private get support(): RoleResult {
        return this.getRoleStats(
            this.client.tvf.roles.staff.support,
            this.client.tvf.roles.staff.heads.support,
            [this.client.tvf.roles.staff.admins, this.client.tvf.roles.staff.forestKeepers]
        );
    }

    private get totalOnline(): number {
        return this.countOnline([...this.client.tvf.roles.staff.staff.members.values()]);
    }

    private get totalStaff(): number {
        return this.client.tvf.roles.staff.staff.members.size;
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
                        `Administrators (${this.administrators.online}/${this.administrators.size})`,
                        stripIndents`
                            **Head**
                            ${this.administrators.heads.join('\n')}

                            **Members**
                            ${this.administrators.members.join('\n')}
    `,
                        true
                    )
                    .addField(
                        `Forest Keepers (${this.forestKeepers.online}/${this.forestKeepers.size})`,
                        stripIndents`
        **Head${this.forestKeepers.heads.length > 1 ? 's' : ''}**
        ${this.forestKeepers.heads.join('\n')}

        **Members**
        ${this.forestKeepers.members.join('\n')}
    `,
                        true
                    )
                    .addField(
                        `Support (${this.support.online}/${this.support.size})`,
                        stripIndents`
            **Head${this.support.heads.length > 1 ? 's' : ''}**
            ${this.support.heads.join('\n')}

            **Members**
            ${this.support.members.join('\n')}
        `,
                        true
                    )
            ]
        });
    }
}
