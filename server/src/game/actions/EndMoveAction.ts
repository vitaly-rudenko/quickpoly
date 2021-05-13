import { Context } from '../Context';
import { Action } from './Action';

export class GiveUpAction extends Action {
    constructor() {
        super({ type: 'giveUp', required: true });
    }

    perform(context: Context): boolean {
        return true;
    }
}
