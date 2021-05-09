import { Action } from '../actions/Action';
import { Space } from './Space';

export class GoSpace extends Space {
    private _salary: number;

    constructor(attributes: { salary: number }) {
        super({ type: 'go' });

        this._salary = attributes.salary;
    }

    getLandActions(): Action[] {
        return [];
    }
}
