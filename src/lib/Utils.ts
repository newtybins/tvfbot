import type { Message } from 'discord.js';
import humanId from 'human-id';

export default class Utils {
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
