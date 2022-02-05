import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Assets directory
 */
export const assetsDir = path.resolve('assets');

/**
 * Discord authentication details
 */
export const discord = {
    token: process.env.NODE_ENV === 'production' ? process.env.STABLE_KEY : process.env.BETA_KEY
};
