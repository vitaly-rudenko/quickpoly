import type { PropertySpace } from '../map/properties/PropertySpace';
import { Context } from '../Context';
import { Log } from '../logs/Log';
import { PropertyPurchasedLog } from '../logs/PropertyPurchasedLog';
import { Action, ActionType } from './Action';

export class PurchasePropertyAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: ActionType.PURCHASE_PROPERTY, required: false });

        this._propertySpace = propertySpace;
    }

    perform(context: Context): Log[] {
        context.player.charge(this._propertySpace.price);
        this._propertySpace.setLandlord(context.player);

        return [
            new PropertyPurchasedLog({
                player: context.player,
                propertySpace: this._propertySpace,
            }),
        ];
    }
}
