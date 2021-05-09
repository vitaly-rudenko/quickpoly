import { Action } from '../actions/Action';
import { MoveContext } from '../MoveContext';

export abstract class Space {
    protected _type: string;

    constructor(attributes: { type: string }) {
        this._type = attributes.type;
    }

    abstract getResidenceActions(context: MoveContext): Action[];
}
