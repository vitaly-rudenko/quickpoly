import { Context } from '../Context';
import { Log } from '../logs/Log';

export abstract class Action {
    protected _type: string;

    constructor(attributes: { type: string }) {
        this._type = attributes.type;
    }

    abstract perform(context: Context): Log[];
}
