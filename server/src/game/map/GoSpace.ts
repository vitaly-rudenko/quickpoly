import { Action } from '../actions/Action';
import { RollDiceAction } from '../actions/RollDiceAction';
import { Space } from './Space';

export class GoSpace extends Space {
    private _salary: number;

    constructor(attributes: { salary: number }) {
        super({ type: 'go' });

        this._salary = attributes.salary;
    }

    getResidenceActions(): Action[] {
        return [
            new RollDiceAction(),
        ];
    }
}
