import {
    Precondition as SapphirePrecondition,
    PieceContext,
    PreconditionOptions,
    PreconditionResult
} from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import Client from '~structures/Client';
import Logger from '~structures/Logger';
import title from 'title';
import { Message as DiscordMessage } from 'discord.js';

abstract class Precondition extends SapphirePrecondition {
    public client: Client;
    public logger: Logger;
    private production: boolean;

    constructor(context: PieceContext, { production, ...options }: Precondition.Options) {
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
            // Unload the precondition
            setTimeout(() => {
                this.unload();

                this.logger.loader(
                    `Forcefully unloaded precondition ${title(
                        this.name
                    )} - it should only be run in production environments!`
                );
            }, 1000);
        } else {
            this.logger.loader(`Successfully loaded precondition ${title(this.name)}!`);
        }

        super.onLoad();
    }

    public onUnload() {
        this.logger.loader(`Successfully unloaded precondition ${title(this.name)}!`);

        super.onUnload();
    }
}

namespace Precondition {
    export type Options = PreconditionOptions & {
        production?: boolean;
    };

    export type Context = PieceContext;
    export type Message = DiscordMessage;
    export type Result = PreconditionResult;

    export const Config = (options: Options) => ApplyOptions<Options>(options);
}

export default Precondition;
