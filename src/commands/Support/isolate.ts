import moment from 'moment';
import * as Discord from 'discord.js';

export default {
  name: 'isolate',
  description: 'Isolates/unisolates a user!',
  args: true,
  usage: '<@user> [reason]',
  aliases: ['unisolate'],
  allowGeneral: true,
  staffAccess: ['Support', 'Moderation'],
  run: async (tvf, msg, args) => {
    await msg.delete();
    args.shift();

    if (tvf.isUser('Support', msg.author) || tvf.isUser('Moderation', msg.author)) {
      // get the tagged member
      const member = tvf.checkForMember(msg, args);

      // prepare the reason
      let reason = args.join(' ');
      if (!reason) reason = 'No reason specified';

      // get the member's document from the database
      const doc = await tvf.userDoc(member.user.id);

      // if the user isn't isolated
      if (!doc.isolated) {
        // get an array of the member's roles
        const roles = member.roles.cache.map(r => r.id);

        // remove the roles from the member and the add the isolated role
        await member.roles.remove(member.roles.cache.array(), 'Isolated').catch(err => tvf.logger.error(err));
        await member.roles.add(tvf.roles.isolation, 'Isolated');

        // update and save the document
        doc.roles = roles;
        doc.isolated = true;

        tvf.saveDoc(doc);

        // alert the staff
        const isolatedAt = moment(msg.createdAt).format(tvf.moment);

        const embed = tvf.createEmbed({ colour: tvf.colours.red, author: true }, msg)
          .setTitle(`${member.user.username} has been isolated.`)
          .addFields([
            {
              name: 'Target',
              value: member.user,
            },
            {
              name: 'Reason',
              value: reason,
            },
          ])
          .setFooter(`Isolated by ${msg.author.username} at ${isolatedAt}`, msg.author.avatarURL());

        tvf.channels.staff.support.send(embed);
        tvf.channels.staff.modlog.send(embed);

        // welcome the user to isolation
        const welcomeEmbed = tvf.createEmbed()
          .setTitle(`Welcome to isolation, ${member.user.username}!`)
          .setDescription(`Hey there, ${member.user.username}! Welcome to isolation! You have been put here by a member of staff - but don't worry, this doesn't necessarily mean you have done something wrong. Staff put people here in order to help people calm down if you're feeling bad, or if you are harming other members of the server. Only you and the staff can see this channel, and it is completely private - feel free to talk to them.`);

        tvf.channels.staff.isolation.send(welcomeEmbed);
      } else if (doc.isolated) {
        // get the user's roles from the database
        const roles: Discord.Collection<string, Discord.Role> = new Discord.Collection();

        for (let i = 0; i < doc.roles.length; i++) {
          const id = doc.roles[i];
          const role = await msg.guild.roles.fetch(id);
          roles.set(id, role);
        }

        // apply the roles to the user
        await member.roles.add(roles, 'Unisolated').catch(err => tvf.logger.error(err));
        await member.roles.remove(tvf.roles.isolation, 'Unisolated');

        // update and save the document
        doc.roles = [];
        doc.isolated = false;

        tvf.saveDoc(doc);

        // alert the staff
        const unisolatedAt = moment(msg.createdAt).format(tvf.moment);

        const embed = tvf.createEmbed({ author: true }, msg)
          .setTitle(`${member.user.username} has been unisolated`)
          .addFields([
            {
              name: 'Target',
              value: member.user,
            },
            {
              name: 'Notes',
              value: reason,
            },
          ])
          .setFooter(`Unisolated by ${msg.author.username} at ${unisolatedAt}`, msg.author.avatarURL());

        tvf.channels.staff.support.send(embed);
        tvf.channels.staff.modlog.send(embed);
        tvf.channels.staff.isolation.send(embed);
      }
    } else {
      msg.author.send(`**${tvf.emojis.cross}  |**  you are not allowed to run this command.`)
    }
  }
} as Command;