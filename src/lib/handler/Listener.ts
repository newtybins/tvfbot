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

    constructor(context: PieceContext, options: Listener.Options) {
        super(context, options);

        this.client = this.container.client;
        this.logger = new Logger(this.client, this.name);
    }

    public onLoad() {
        this.logger.loader(`Successfully loaded listener ${title(this.name)}!`);
        super.onLoad();
    }

    public onUnload() {
        if (!this.once) this.logger.loader(`Successfully unloaded listener ${title(this.name)}!`);
        super.onUnload();
    }
}

namespace Listener {
    export type Options = ListenerOptions;
    export type Context = PieceContext;

    export const Config = (options: Options) => ApplyOptions<Options>(options);
    export const Events = SapphireEvents;
}

export default Listener;
