import type { PropertySpace } from '../map/properties/PropertySpace';
import { Context } from '../Context';
import { Log } from '../logs/Log';
import { PropertyRentPaidLog } from '../logs/PropertyRentPaidLog';
import { Action, ActionType } from './Action';
import { RequiredActionPostponedError } from './RequiredActionPostponedError';

export class PayPropertyRentAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: ActionType.PAY_PROPERTY_RENT, required: true });

        this._propertySpace = propertySpace;
    }

    perform(context: Context): Log[] {
        const landlord = this._propertySpace.landlord;
        if (landlord === null) {
            throw new Error('Property is not owned by anybody');
        }

        const amount = this._propertySpace.calculateRent();

        if (!context.player.canPay(amount)) {
            throw new RequiredActionPostponedError();
        }

        context.player.charge(amount);
        landlord.topUp(amount);

        return [
            new PropertyRentPaidLog({
                landlord,
                tenant: context.player,
                propertySpace: this._propertySpace,
                amount,
            }),
        ];
    }
}
