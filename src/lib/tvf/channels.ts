import type { Guild, TextChannel } from 'discord.js';

const fetchChannels = async (tvf: Guild) => {
    const channels = {
        levelUp: '939611382167519275',
        rules: '481124133606916096',
        support: '761718388090863616',
        meetTheStaff: '927981329675583541',
        roles: '481131558296616961',
        theWoods: '435894444584075265',
        helpers: '471799568015818762',
        resources: '960649620759937044'
    };

    for (const key in channels) {
        channels[key] = (await tvf.channels.fetch(channels[key])) as TextChannel;
    }

    return channels as unknown as { [key in keyof typeof channels]: TextChannel };
};

export default fetchChannels;
