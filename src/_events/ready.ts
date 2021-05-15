import Client from '..';
import Constants from '../Constants';
import { CronJob } from 'cron';

export default (tvf: Client) => {
  // @ts-ignore
  tvf.const = Constants(tvf.server);

  // set the bot's activity
  tvf.user.setActivity('over you cuties <3', { type: 'WATCHING' });
  tvf.logger.info('TVF Bot is ready.');

  // daily role income
  if (tvf.isProduction) {
    new CronJob('0 0 * * *', () => {
      tvf.const.channels.staff.hooters.send('Handing out role incomes!');

      tvf.server.members.cache.array().forEach(async (m, i) => {
        setTimeout(async () => {
          const doc = await tvf.userDoc(m.id);
          await tvf.updateBalance(m.id, { cash: 0, bank: doc.level * 50, reason: 'Role income!' });
          tvf.logger.info(`Increased ${m.user.tag} (Level ${doc.level})'s balance by ${doc.level * 50}!`);
        }, i * 750);
      });
    }, true, 'Europe/London');
  }
};