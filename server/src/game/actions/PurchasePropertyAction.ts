import type { PropertySpace } from '../map/properties/PropertySpace';
import type { Context } from '../Context';
import { PropertyPurchasedLog } from '../logs/PropertyPurchasedLog';
import { Action } from './Action';

export class PurchasePropertyAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: 'purchaseProperty', required: true });
        this._propertySpace = propertySpace;
    }

    perform(context: Context): boolean {
        context.move.player.charge(this._propertySpace.price);
        this._propertySpace.setLandlord(context.move.player);

        context.log(
            new PropertyPurchasedLog({
                player: context.move.player,
                propertySpace: this._propertySpace,
            })
        );

        return true;
    }
}
