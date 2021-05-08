import type { PropertySpace } from '../map/properties/PropertySpace';
import { Context } from '../Context';
import { Log } from '../logs/Log';
import { PropertyRentPaidLog } from '../logs/PropertyRentPaidLog';
import { Action } from './Action';

export class PayPropertyRentAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: 'payPropertyRent', required: true });

        this._propertySpace = propertySpace;
    }

    perform(context: Context): Log[] {
        const amount = this._propertySpace.calculateRent();
        context.player.charge(amount);

        return [
            new PropertyRentPaidLog({
                player: context.player,
                propertySpace: this._propertySpace,
                amount,
            }),
        ];
    }
}
