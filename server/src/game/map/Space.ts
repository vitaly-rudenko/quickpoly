import { Action } from '../actions/Action';
import { Context } from '../Context';

export abstract class Space {
    protected _type: string;

    constructor(attributes: { type: string }) {
        this._type = attributes.type;
    }

    abstract getLandActions(context: Context): Action[];
}
