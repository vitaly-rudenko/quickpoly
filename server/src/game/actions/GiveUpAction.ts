import { Context } from '../Context';
import { Action } from './Action';

export class GiveUpAction extends Action {
    constructor() {
        super({ type: 'giveUp', skippable: true });
    }

    perform(context: Context): boolean {
        throw new Error('Not implemented');
    }
}
