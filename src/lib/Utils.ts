import type { Message } from 'discord.js';
import humanId from 'human-id';
import { LevelReward, levelRewards } from '~config';
import Client from '~structures/Client';

export default class Utils {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public get id() {
        return humanId({
            separator: '-',
            capitalize: false
        });
    }

    /**
     * Calculates the amount of xp required for a level.
     */
    public calculateXp(level: number): number {
        return (625 * level ** 2) / 9;
    }

    /**
     * Finds the level reward for a given level!
     * @param {number} level
     */
    public findLevelReward(level: number): LevelReward {
        const levelIndex = levelRewards.findIndex(l =>
            level % 2 === 0 ? l.level === level : l.level === level - 1
        );

        return levelRewards[levelIndex];
    }

    public async findLevelRewardName(reward: LevelReward) {
        const role = await this.client.tvf.server.roles.fetch(reward.roleId);

        return role.name;
    }

    /**
     * Sort an array of strings alphabetically
     */
    public sortAlphabetically<T>(input: T[], property?: T extends string ? any : keyof T): T[] {
        if (input[0] instanceof String) {
            // @ts-ignore
            return input.sort((a: string, b: string) => a.localeCompare(b));
        } else return input.sort((a: any, b: any) => a[property].localeCompare(b[property]));
    }

    /**
     * Make a message delete itself after x seconds
     */
    public deleteMessageAfter(message: Message, seconds: number = 2) {
        setTimeout(async () => {
            await message.delete();
        }, seconds * 1000);
    }
}
