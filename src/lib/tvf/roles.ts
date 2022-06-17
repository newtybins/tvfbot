import type { Guild, Role } from 'discord.js';

const fetchRoles = async (tvf: Guild) => {
    const roles = {
        staff: '452662935035052032',
        forestKeepers: '435897654682320925',
        hackerbeing: '462606587404615700',
        welcomeTeam: '499302826028302368',
        helper: '481130628344184832'
    };

    for (const key in roles) {
        roles[key] = (await tvf.roles.fetch(roles[key])) as Role;
    }

    return roles as unknown as { [key in keyof typeof roles]: Role };
};

export default fetchRoles;
