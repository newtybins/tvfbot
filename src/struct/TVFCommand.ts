import { Command, CommandOptions, PieceContext, PreconditionEntryResolvable, PermissionsPrecondition } from '@sapphire/framework';
import path from 'path';

export default abstract class TVFCommand extends Command {
	public fullCategory: string[];

	public constructor(context: PieceContext, { name, ...options }: CommandOptions) {
		super(context, { name, ...options });

		const paths = context.path.split(path.sep);
		this.fullCategory = paths.slice(paths.indexOf('commands') + 1, -1);

		// Preconditions
		if (!options.preconditions) options.preconditions = [];
		if (options.cooldown) (options.preconditions as PreconditionEntryResolvable[]).push({ name: 'Cooldown', context: { delay: options.cooldown * 1000 } });
        if (options.permissions) (options.preconditions as PreconditionEntryResolvable[]).push(new PermissionsPrecondition(options.permissions));
	}

	public get category() {
		return this.fullCategory[0] ?? 'Core';
	}
}
