import Listener from '~handler/Listener';
import fs from 'fs';
import path from 'path';
import { assetsDir } from '~config';
import type { ExcludeEnum } from 'discord.js';
import type { ActivityTypes } from 'discord.js/typings/enums';

@Listener.Config({
    name: 'ready',
    event: Listener.Events.ClientReady,
    once: true
})
export default class Ready extends Listener<typeof Listener.Events.ClientReady> {
    private statusList: string[];

    constructor(context: Listener.Context, options: Listener.Options) {
        super(context, options);

        // Read in all of the statuses
        try {
            this.statusList = fs
                .readFileSync(path.join(assetsDir, 'statuses.txt'))
                .toString()
                .split('\n')
                .filter(status => status.trim() !== '');

            this.logger.info(
                `Succesfully read ${this.statusList.length} status(es) from the disk!`
            );
        } catch (e) {
            this.logger.error('There was a problem parsing the statuses file. Exiting bot!');
            process.exit();
        }
    }

    private updateStatus() {
        const [type, ...value] =
            this.statusList[Math.floor(Math.random() * this.statusList.length)].split(' ');

        this.client.user.setActivity({
            type: type.toUpperCase() as ExcludeEnum<typeof ActivityTypes, 'CUSTOM'>,
            name: value.join(' ')
        });
    }

    async run() {
        // Update the bot's status periodically
        this.updateStatus();
        setInterval(() => this.updateStatus(), 10000);

        // fin!
        this.logger.info('I am ready (:');
    }
}
