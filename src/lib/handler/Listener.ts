import {
    Listener as SapphireListener,
    PieceContext,
    ListenerOptions,
    Events as SapphireEvents
} from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import Client from '~structures/Client';
import Logger from '~structures/Logger';
import title from 'title';
import { ClientEvents } from 'discord.js';

abstract class Listener<E extends keyof ClientEvents> extends SapphireListener<E> {
    public client: Client;
    public logger: Logger;
    private production: boolean;

    constructor(context: PieceContext, { production, ...options }: Listener.Options) {
        super(context, options);

        this.client = this.container.client;
        this.logger = new Logger(this.client, this.name);
        this.production = production ?? false;
    }

    private get shouldRun(): boolean {
        return (this.production && this.client.production) || !this.production;
    }

    public onLoad() {
        if (!this.shouldRun) {
            // Unload the listener
            setTimeout(() => {
                this.unload();

                this.logger.loader(
                    `Forcefully unloaded ${title(
                        this.name
                    )} - it should only be run in production environments!`
                );
            }, 1000);
        } else {
            this.logger.loader(`Successfully loaded listener ${title(this.name)}!`);
        }

        super.onLoad();
    }

    public onUnload() {
        if (this.shouldRun && !this.once) {
            this.logger.loader(`Successfully unloaded listener ${title(this.name)}!`);
        }

        super.onUnload();
    }
}

namespace Listener {
    export type Options = ListenerOptions & {
        production?: boolean;
    };

    export type Context = PieceContext;

    export const Config = (options: Options) => ApplyOptions<Options>(options);
    export const Events = {
        ...SapphireEvents,
        Levelling: {
            GetXp: 'getXp',
            LevelUp: 'levelUp'
        }
    };
}

export default Listener;
