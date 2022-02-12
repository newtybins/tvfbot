import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Utility types
type Colour = `#${string}`;

interface LevelReward {
    level: number;
    roleId: string;
}

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
export const errorColour: Colour = '#ff6961';
export const successColour: Colour = '#04ac84';
export const newtId = '326767126406889473';
export const tick = '✅';
export const hour = 3600000;

export const timeouts: {
    [key: string]: number;
} = {
    xpMs: 60000,
    privateHours: 6
};

export const levelRewards: LevelReward[] = [
    { level: 2, roleId: '441943660016173058' },
    { level: 4, roleId: '466738306881814536' },
    { level: 6, roleId: '441944499149602816' },
    { level: 8, roleId: '466738333649731587' },
    { level: 10, roleId: '441944655450603520' },
    { level: 12, roleId: '441945051296301057' },
    { level: 14, roleId: '441945301721415681' },
    { level: 16, roleId: '466739322054246401' },
    { level: 18, roleId: '453950866815320085' },
    { level: 20, roleId: '453950669573849091' },
    { level: 22, roleId: '441945780119535637' },
    { level: 24, roleId: '453947107825680396' },
    { level: 26, roleId: '453950089451405322' },
    { level: 28, roleId: '466738356831649793' },
    { level: 30, roleId: '453947113643048982' },
    { level: 32, roleId: '453949450902044715' },
    { level: 34, roleId: '453947119842099222' },
    { level: 36, roleId: '466739004432318466' },
    { level: 38, roleId: '453950908640788480' },
    { level: 40, roleId: '635836969527541770' },
    { level: 42, roleId: '640501774985461790' },
    { level: 44, roleId: '799084406354346054' },
    { level: 46, roleId: '799084468144308274' },
    { level: 48, roleId: '799084509667655721' },
    { level: 50, roleId: '801521919454609438' },
    { level: 52, roleId: '799084536151277588' },
    { level: 54, roleId: '799084584067137580' },
    { level: 56, roleId: '801518871927455794' },
    { level: 58, roleId: '801518874113474631' },
    { level: 60, roleId: '801518876395044904' },
    { level: 62, roleId: '801518878211571713' },
    { level: 64, roleId: '801518880656064592' },
    { level: 66, roleId: '801518881314177116' },
    { level: 68, roleId: '801518884863606845' },
    { level: 70, roleId: '799084559366881321' },
    { level: 72, roleId: '801518887053033502' },
    { level: 74, roleId: '801518889102999602' },
    { level: 76, roleId: '801518890978246706' },
    { level: 78, roleId: '801518911165825125' },
    { level: 80, roleId: '801518914190180392' },
    { level: 82, roleId: '801518919055573063' },
    { level: 84, roleId: '801520771876913242' },
    { level: 86, roleId: '801520780876841001' },
    { level: 88, roleId: '801520784555769888' },
    { level: 90, roleId: '799084616350040064' },
    { level: 92, roleId: '799084438402891786' },
    { level: 94, roleId: '801520795347320853' },
    {
        level: 96,
        roleId: '801520798430265374'
    },
    { level: 98, roleId: '799084638936367155' },
    { level: 100, roleId: '801520799189958676' }
];
