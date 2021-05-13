import { Context } from '../Context';
import { PassedLog } from '../logs/PassedLog';
import { Action } from './Action';

export class GiveUpAction extends Action {
    constructor() {
        super({ type: 'giveUp' });
    }

    perform(context: Context): boolean {
        throw new Error('Not implemented');
    }
}
