import type { PropertySpace } from '../map/properties/PropertySpace';
import type { MoveContext } from '../MoveContext';
import type { Log } from '../logs/Log';
import { PropertyPurchasedLog } from '../logs/PropertyPurchasedLog';
import { Action, ActionType } from './Action';

export class PurchasePropertyAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: ActionType.PURCHASE_PROPERTY, required: false });

        this._propertySpace = propertySpace;
    }

    perform(context: MoveContext): Log[] {
        context.movePlayer.charge(this._propertySpace.price);
        this._propertySpace.setLandlord(context.movePlayer);

        return [
            new PropertyPurchasedLog({
                player: context.movePlayer,
                propertySpace: this._propertySpace,
            }),
        ];
    }
}
