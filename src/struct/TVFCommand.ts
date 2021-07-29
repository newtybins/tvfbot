import { Command, CommandOptions, PieceContext } from '@sapphire/framework';
import path from 'path';

export default abstract class TVFCommand extends Command {
	public fullCategory: string[];

	public constructor(context: PieceContext, { name, ...options }: CommandOptions) {
		super(context, { name, ...options });

		const paths = context.path.split(path.sep);
		this.fullCategory = paths.slice(paths.indexOf('commands') + 1, -1);
	}

	public get category() {
		return this.fullCategory[0] ?? 'Core';
	}
}
