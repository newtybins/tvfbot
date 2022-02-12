import type { Guild, TextChannel } from 'discord.js';

const fetchChannels = async (tvf: Guild) => {
    return {
        arbour: {
            levelUp: (await tvf.channels.fetch('939611382167519275')) as TextChannel
        },
        staff: {
            support: (await tvf.channels.fetch('761718388090863616')) as TextChannel
        }
    };
};

export default fetchChannels;
