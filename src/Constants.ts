import { Guild, TextChannel, CategoryChannel } from 'discord.js';

enum Colours {
	Red = 0xFF6961,
	Green = 0x3AA4AE,
	Orange = 0xFFB861,
	Yellow = 0xFFC600,
	White = 0xFFFFFF
}

enum Emojis {
	Wave = '👋',
	Tick = '✅',
	Cross = '❌',
	Confetti = '🎉',
	Upvote = '760820779344068609',
	Downvote = '760820793507971093'
}

enum SuggestionStatus {
	Suggested = 0,
	Approved = 1,
	Denied = 2,
	Considered = 3
}

export default {
	Colours,
	Emojis,
	SuggestionStatus,

	levelRoles: [
		{ level: 2, roleID: '441943660016173058', name: 'Elf' },
		{ level: 4, roleID: '466738306881814536', name: 'Goblin' },
		{ level: 6, roleID: '441944499149602816', name: 'Gnome' },
		{ level: 8, roleID: '466738333649731587', name: 'Brownie' },
		{ level: 10, roleID: '441944655450603520', name: 'Fairy' },
		{ level: 12, roleID: '441945051296301057', name: 'Leprechaun' },
		{ level: 14, roleID: '441945301721415681', name: 'Faun' },
		{ level: 16, roleID: '466739322054246401', name: 'Harpy' },
		{ level: 18, roleID: '453950866815320085', name: 'Leshy' },
		{ level: 20, roleID: '453950669573849091', name: 'Nymph' },
		{ level: 22, roleID: '441945780119535637', name: 'Dryad' },
		{ level: 24, roleID: '453947107825680396', name: 'Centaur' },
		{ level: 26, roleID: '453950089451405322', name: 'Warlock' },
		{ level: 28, roleID: '466738356831649793', name: 'Phoenix' },
		{ level: 30, roleID: '453947113643048982', name: 'Griffin' },
		{ level: 32, roleID: '453949450902044715', name: 'Sphinx' },
		{ level: 34, roleID: '453947119842099222', name: 'Unicorn' },
		{ level: 36, roleID: '466739004432318466', name: 'Dragon' },
		{ level: 38, roleID: '453950908640788480', name: 'Hydra' },
		{ level: 40, roleID: '635836969527541770', name: 'Behemoth' },
		{ level: 42, roleID: '640501774985461790', name: 'Eldritch Being' },
		{ level: 44, roleID: '799084406354346054', name: 'Banshee' },
		{ level: 46, roleID: '799084468144308274', name: 'Cockatrice' },
		{ level: 48, roleID: '799084509667655721', name: 'Barghest' },
		{ level: 50, roleID: '801521919454609438', name: 'Draugr' },
		{ level: 52, roleID: '799084536151277588', name: 'Treant' },
		{ level: 54, roleID: '799084584067137580', name: 'Dullahan' },
		{ level: 56, roleID: '801518871927455794', name: 'Yokai' },
		{ level: 58, roleID: '801518874113474631', name: 'Kelpie' },
		{ level: 60, roleID: '801518876395044904', name: 'Jötnar' },
		{ level: 62, roleID: '801518878211571713', name: 'Rusalka' },
		{ level: 64, roleID: '801518880656064592', name: 'Kitsune' },
		{ level: 66, roleID: '801518881314177116', name: 'Fomorian' },
		{ level: 68, roleID: '801518884863606845', name: 'Jörmungandr' },
		{ level: 70, roleID: '799084559366881321', name: 'Erlking' },
		{ level: 72, roleID: '801518887053033502', name: 'River Deity' },
		{ level: 74, roleID: '801518889102999602', name: 'Spriggan' },
		{ level: 76, roleID: '801518890978246706', name: 'Hippogriff' },
		{ level: 78, roleID: '801518911165825125', name: 'Pixie' },
		{ level: 80, roleID: '801518914190180392', name: 'Pegasus' },
		{ level: 82, roleID: '801518919055573063', name: 'Chimera' },
		{ level: 84, roleID: '801520771876913242', name: 'Basilisk' },
		{ level: 86, roleID: '801520780876841001', name: 'Forest Spirit' },
		{ level: 88, roleID: '801520784555769888', name: 'Moth Man' },
		{ level: 90, roleID: '799084616350040064', name: 'Dirt' },
		{ level: 92, roleID: '799084438402891786', name: 'David Bowie' },
		{ level: 94, roleID: '801520795347320853', name: 'Rel' },
		{ level: 96, roleID: '801520798430265374', name: 'Dwayne "The Rock" Johnson' },
		{ level: 98, roleID: '799084638936367155', name: 'Gandalf' },
		{ level: 100, roleID: '801520799189958676', name: 'how?' }
	],

	// voiceID: textID
	vcLink: {
		'435894444584075267': '452308488064991243', // Treehouse
		'451348503034200095': '435916285944266763', // Music
		'435917093070700584': '593171690205478913', // Chillax
		'506157687713693697': '506195134854070290', // Karaoke
		'597100763583479818': '632090740410810378', // Gaming
		'435917223098580992': '508412490539991040' // Venting
	},

	moment: 'ddd, MMM Do, YYYY h:mm A',
	privateTimeout: 21600000,
	blank: '\u200B'
}

const Roles = (tvf: Guild) => {
	const getRole = (id: string) => tvf.roles.cache.get(id);

	return {
		staff: getRole('452662935035052032'),
		moderators: getRole('435897654682320925'),
		support: getRole('761713326597865483'),
		hackerbeing: getRole('462606587404615700'),
		admins: getRole('452553630105468957'),
		modHead: getRole('761714520535334922'),
		supportHead: getRole('761714525161652224'),
		helper: getRole('481130628344184832'),
		welcomeTeam: getRole('499302826028302368'),
		bot: getRole('451344230023954442'),
	}
}

const Channels = (tvf: Guild) => {
	const getChannel = (id: string) => tvf.channels.cache.get(id);
	const getText = (id: string) => getChannel(id) as TextChannel;
	const getCategory = (id: string) => getChannel(id) as CategoryChannel;

	return {
		general: getText('435894444584075265'),
		tw: getText('618002057189785601'),
		resources: getText('435923980336234516'),
		rules: getText('481124133606916096'),
		roles: getText('481131558296616961'),
		meetTheStaff: getText('479744966575390733'),
		announcements: getText('435910303864061962'),
		botCommands: getText('464655374050656256'),
		privateVenting: {
			category: getCategory('768113425867472936'),
			logs: getText('768113624861507624')
		},
		supportChat: getText('761718388090863616'),
		modChat: getText('452905389596475404'),
		modLogs: getText('499652797638115348'),
		femboyHooters: getText('454382546181160961'),
		suggestions: getText('474242779623456779'),
		starboard: getText('646971709853007873'),
		discussion: getText('458009085829316609'),
		helpers: getText('471799568015818762')
	}
}

export {
	Roles,
	Channels
}
