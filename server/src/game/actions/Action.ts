import type { Context } from '../Context';

export abstract class Action {
    private _type: string;
    private _required: boolean;
    private _automatic: boolean;
    private _skippable: boolean;

    constructor(attributes: {
        type: string,
        required?: boolean,
        automatic?: boolean,
        skippable?: boolean,
    }) {
        this._type = attributes.type;
        this._required = attributes?.required ?? false;
        this._automatic = attributes?.automatic ?? false;
        this._skippable = attributes?.skippable ?? false;
    }

    abstract perform(context: Context, data?: any): boolean;

    applies(data?: any): boolean {
        return true;
    }

    get type(): string {
        return this._type;
    }

    get required(): boolean {
        return this._required;
    }

    get automatic(): boolean {
        return this._automatic;
    }

    get skippable(): boolean {
        return this._skippable;
    }
}
