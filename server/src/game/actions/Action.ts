import type { MoveContext } from '../MoveContext';
import type { Log } from '../logs/Log';

export enum ActionType {
    ROLL_DICE = 'rollDice',
    PURCHASE_PROPERTY = 'purchaseProperty',
    PUT_PROPERTY_UP_FOR_AUCTION = 'putPropertyUpForAuction',
    PAY_PROPERTY_RENT = 'payPropertyRent',
}

export abstract class Action {
    protected _type: ActionType;
    protected _required: boolean;

    constructor(attributes: { type: ActionType, required: boolean }) {
        this._type = attributes.type;
        this._required = attributes.required;
    }

    abstract perform(context: MoveContext): Log[];

    get type(): ActionType {
        return this._type;
    }

    get required(): boolean {
        return this._required;
    }
}
