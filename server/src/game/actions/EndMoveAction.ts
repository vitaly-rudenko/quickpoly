import { Context } from '../Context';
import { Action } from './Action';

export class EndMoveAction extends Action {
    constructor() {
        super({ type: 'endMoveAction', required: true });
    }

    perform(context: Context): boolean {
        return true;
    }
}
