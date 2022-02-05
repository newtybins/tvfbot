export default class Utils {
    /**
     * Calculates the amount of xp required for a level.
     */
    calculateXp(level: number): number {
        return (625 * level ** 2) / 9;
    }
}
