import { Command, CommandOptions, PieceContext, PreconditionEntryResolvable, PermissionsPrecondition } from '@sapphire/framework';
import path from 'path';

export default abstract class TVFCommand extends Command {
	public fullCategory: string[];

	public constructor(context: PieceContext, { name, ...options }: CommandOptions) {
		const paths = context.path.split(path.sep);
		const fullCategory = paths.slice(paths.indexOf('commands') + 1, -1);
		const category = (fullCategory[0] ?? 'Core').toLowerCase();

		// Preconditions
		if (!options.preconditions) options.preconditions = [];
		if (options.cooldown) (options.preconditions as PreconditionEntryResolvable[]).push({ name: 'Cooldown', context: { delay: options.cooldown * 1000 } });
        if (options.permissions) (options.preconditions as PreconditionEntryResolvable[]).push(new PermissionsPrecondition(options.permissions));
		if (options.general) (options.preconditions as PreconditionEntryResolvable[]).push({ name: 'general', context: null }); 
		(options.preconditions as PreconditionEntryResolvable[]).push({ name: 'blacklist', context: null });

		// Load category-specific preconditions
		if (category === 'admin') (options.preconditions as PreconditionEntryResolvable[]).push({ name: 'admin', context: null});
		if (category === 'support') (options.preconditions as PreconditionEntryResolvable[]).push({ name: 'support', context: null});

		super(context, { name, ...options });
		
		this.fullCategory = fullCategory;
	}

	public get category() {
		return this.fullCategory[0] ?? 'Core';
	}
}
