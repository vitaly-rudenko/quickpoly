import type { PropertySpace } from '../map/properties/PropertySpace';
import type { Context } from '../Context';
import { Action } from './Action';
import { PropertyRentPaidLog } from '../logs/PropertyRentPaidLog';

export class PayPropertyRentAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: 'payPropertyRent', required: true, automatic: true });
        this._propertySpace = propertySpace;
    }

    perform(context: Context): boolean {
        const landlord = this._propertySpace.landlord;
        if (landlord === null) {
            throw new Error('Property is not owned by anybody');
        }

        const amount = this._propertySpace.calculateRent();

        if (!context.move.player.canPay(amount)) {
            return false;
        }

        context.move.player.charge(amount);
        landlord.topUp(amount);

        context.log(
            new PropertyRentPaidLog({
                landlord,
                tenant: context.move.player,
                propertySpace: this._propertySpace,
                amount,
            })
        );

        return true;
    }
}
