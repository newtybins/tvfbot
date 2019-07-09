/*
.......##.......##....########..####.##....##..######..
......##.......##.....##.....##..##..###...##.##....##.
.....##.......##......##.....##..##..####..##.##.......
....##.......##.......########...##..##.##.##.##...####
...##.......##........##.........##..##..####.##....##.
..##.......##.........##.........##..##...###.##....##.
.##.......##..........##........####.##....##..######..
*/
export const command: Command = {
    run: async (client, msg) => {
        if (!msg.mentions.members.first()) return msg.reply('you need to tag someone to hug 🤗');

        await msg.delete();
        return msg.channel.send(`${msg.author} hugged ${msg.mentions.members.first()} 🤗💞`)
    },
    config: {
        name: 'hug',
        args: true,
        usage: '<@user>',
        description: 'Hug another user in the server.'
    }
}