import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
type Colour = `#${string}`;

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

export const breathingGif = 'https://media.giphy.com/media/krP2NRkLqnKEg/giphy.gif';
export const tvfId = '435894444101861408';
export const tvfColour: Colour = '#16c3b3';
