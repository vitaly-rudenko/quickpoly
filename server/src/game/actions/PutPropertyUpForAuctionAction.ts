import type { PropertySpace } from '../map/properties/PropertySpace';
import { MoveContext } from '../MoveContext';
import { Log } from '../logs/Log';
import { Action, ActionType } from './Action';
import { PropertyPutUpForAuctionLog } from '../logs/PropertyPutUpForAuctionLog';

export class PutPropertyUpForAuctionAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: ActionType.PUT_PROPERTY_UP_FOR_AUCTION, required: false });

        this._propertySpace = propertySpace;
    }

    perform(context: MoveContext): Log[] {
        return [
            new PropertyPutUpForAuctionLog({
                propertySpace: this._propertySpace,
            }),
        ];
    }
}
