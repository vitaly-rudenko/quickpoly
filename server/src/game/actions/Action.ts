import { Context } from '../Context';
import { Log } from '../logs/Log';

export abstract class Action {
    protected _type: string;
    protected _required: boolean;

    constructor(attributes: { type: string, required: boolean }) {
        this._type = attributes.type;
        this._required = attributes.required;
    }

    abstract perform(context: Context): Log[];

    get type(): string {
        return this._type;
    }

    get required(): boolean {
        return this._required;
    }
}
