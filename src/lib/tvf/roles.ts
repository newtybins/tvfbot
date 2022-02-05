import { Guild } from 'discord.js';

const fetchRoles = async (tvf: Guild) => {
    return {
        staff: {
            staff: await tvf.roles.fetch('452662935035052032'),
            forestKeepers: await tvf.roles.fetch('435897654682320925'),
            support: await tvf.roles.fetch('761713326597865483'),
            admins: await tvf.roles.fetch('452553630105468957'),
            heads: {
                forestKeepers: await tvf.roles.fetch('761714520535334922'),
                support: await tvf.roles.fetch('761714525161652224')
            },
            hackerbeing: await tvf.roles.fetch('462606587404615700')
        }
    };
};

export default fetchRoles;
