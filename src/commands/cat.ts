import * as Discord from 'discord.js';

export default {
  name: 'cat',
  description: 'Get a picture of a cat ^w^',
  module: 'Core',
  aliases: ['catto', 'kitty'],
  run: async (tvf, msg) => msg.channel.send(new Discord.MessageAttachment((await tvf.randomImage('cat')).url)),
} as Command;
