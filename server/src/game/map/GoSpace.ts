import { Action } from '../actions/Action';
import { RollDiceAction } from '../actions/RollDiceAction';
import { Context } from '../Context';
import { Space } from './Space';

export class GoSpace extends Space {
    private _salary: number;

    constructor(attributes: { salary: number }) {
        super({ type: 'go' });

        this._salary = attributes.salary;
    }

    getResidenceActions(context: Context): Action[] {
        const actions: Action[] = [];

        if (!context.auction) {
            if (!context.move.hasActionBeenPerformed('rollDice')) {
                actions.push(new RollDiceAction());
            }
        }

        return actions;
    }
}
