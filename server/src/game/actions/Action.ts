import { Context } from '../Context';
import { Log } from '../logs/Log';

export enum ActionType {
    PURCHASE_PROPERTY = 'purchaseProperty',
    PAY_PROPERTY_RENT = 'payPropertyRent',
}

export abstract class Action {
    protected _type: ActionType;
    protected _required: boolean;

    constructor(attributes: { type: ActionType, required: boolean }) {
        this._type = attributes.type;
        this._required = attributes.required;
    }

    abstract perform(context: Context): Log[];

    get type(): ActionType {
        return this._type;
    }

    get required(): boolean {
        return this._required;
    }
}
