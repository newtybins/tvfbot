import type { APIEmbed, APIGuild, APIUser } from 'discord-api-types';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { REST as RESTClient } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { discord, errorColour, successColour, tvfColour, tvfId } from '~config';

const rest = new RESTClient();
rest.setToken(discord.token);

// Get the server icon's URL
let guildIcon: string;

rest.get(Routes.guild(tvfId)).then((guild: APIGuild) => {
    guildIcon = rest.cdn.icon(tvfId, guild.icon);
});

// Get the user's icon URL
let userIcon: string;

rest.get(Routes.user()).then((user: APIUser) => {
    userIcon = rest.cdn.avatar(user.id, user.avatar);
});

type EmbedType = 'normal' | 'success' | 'error';

export default class Embed extends MessageEmbed {
    constructor(type: EmbedType = 'normal', data?: MessageEmbed | MessageEmbedOptions | APIEmbed) {
        super(data);

        // Update the colour
        switch (type) {
            case 'normal':
                this.setColor(tvfColour);
                break;
            case 'error':
                this.setColor(errorColour);
                break;
            case 'success':
                this.setColor(successColour);
                break;
        }

        // Update the footer
        this.setFooter({
            text: 'The Venting Forest, serving users since April 2018.',
            iconURL: guildIcon
        });

        this.setThumbnail(userIcon);
    }
}
