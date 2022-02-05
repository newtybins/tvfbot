import { Command as SapphireCommand, CommandOptions, PieceContext } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import Client from '~structures/Client';
import Logger from '~structures/Logger';
import title from 'title';

abstract class Command extends SapphireCommand {
    public client: Client;
    public logger: Logger;

    constructor(context: PieceContext, options: Command.Options) {
        super(context, options);

        this.client = this.container.client;
        this.logger = new Logger(this.client, this.name);
    }

	public onLoad() {
		this.logger.loader(`Successfully loaded command ${title(this.name)}!`);
		super.onLoad();
	}

	public onUnload() {
		this.logger.loader(`Successfully unloaded command ${title(this.name)}!`);
		super.onUnload();
	}
}

namespace Command {
    export type Options = CommandOptions;

    export const Config = (options: Options) => ApplyOptions<Options>(options);
}

export default Command;
