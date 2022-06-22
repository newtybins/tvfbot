import { CategoryChannel, Guild, TextChannel } from 'discord.js';

const fetchChannels = async (tvf: Guild) => {
    // Resolve channels
    const channels = {
        levelUp: '939611382167519275',
        rules: '481124133606916096',
        support: '761718388090863616',
        meetTheStaff: '927981329675583541',
        roles: '481131558296616961',
        theWoods: '435894444584075265',
        helpers: '471799568015818762',
        resources: '960649620759937044',
        suggestions: '474242779623456779',
        botCommands: '464655374050656256',
        testing: '454382546181160961'
    };

    for (const key in channels) {
        channels[key] = (await tvf.channels.fetch(channels[key])) as TextChannel;
    }

    // Venting channels
    const ventingCategories = [
        '435911798747824128',
        '896459993321189397',
        '454099184245669888',
        '454099602174377992',
        '454099702724427776',
        '454100028097822740',
        '454100371229507595'
    ];

    const ventingChannels: TextChannel[] = [];

    for (const categoryId of ventingCategories) {
        const category = (await tvf.channels.fetch(categoryId)) as CategoryChannel;

        if (category) {
            for (const channel of category.children) {
                if (channel instanceof TextChannel) ventingChannels.push(channel);
            }
        }
    }

    return {
        ...channels,
        ventingChannels
    } as unknown as { [key in keyof typeof channels]: TextChannel } & {
        ventingChannels: TextChannel[];
    };
};

export default fetchChannels;
