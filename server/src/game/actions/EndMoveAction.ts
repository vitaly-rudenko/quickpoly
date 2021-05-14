import { Context } from '../Context';
import { MoveEndedLog } from '../logs/MoveEndedLog';
import { Action } from './Action';

export class EndMoveAction extends Action {
    constructor() {
        super({ type: 'endMove', required: true });
    }

    perform(context: Context): boolean {
        context.log(
            new MoveEndedLog({ player: context.move.player })
        );

        return true;
    }
}
