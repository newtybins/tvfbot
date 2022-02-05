import type { APIEmbed, APIGuild } from 'discord-api-types';
import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { REST as RESTClient } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { discord, tvfColour, tvfId } from '~config';

// Get the server icon's URL
let iconURL: string;

const rest = new RESTClient();
rest.setToken(discord.token);

rest.get(Routes.guild(tvfId)).then((guild: APIGuild) => {
    iconURL = rest.cdn.icon(tvfId, guild.icon);
});

export default class Embed extends MessageEmbed {
    constructor(data?: MessageEmbed | MessageEmbedOptions | APIEmbed) {
        super(data);

        this.setColor(tvfColour);

        this.setFooter({
            text: 'The Venting Forest, serving users since April 2018.',
            iconURL
        });
    }
}
