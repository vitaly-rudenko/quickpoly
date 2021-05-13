import type { Action } from '../actions/Action';
import type { Context } from '../Context';

export abstract class Space {
    protected _type: string;

    constructor(attributes: { type: string }) {
        this._type = attributes.type;
    }

    abstract getResidenceActions(context: Context): Action[];

    getGlobalActions(context: Context): Action[] {
        return [];
    }
}
