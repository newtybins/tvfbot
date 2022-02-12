import type { CategoryChannel, Guild } from 'discord.js';

const fetchCategories = async (tvf: Guild) => {
    return {
        privateVenting: (await tvf.channels.fetch('768113425867472936')) as CategoryChannel
    };
};

export default fetchCategories;
