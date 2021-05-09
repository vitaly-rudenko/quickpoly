import type { PropertySpace } from '../map/properties/PropertySpace';
import type { MoveContext } from '../MoveContext';
import type { Log } from '../logs/Log';
import { Action, ActionType } from './Action';
import { PropertyRentPaidLog } from '../logs/PropertyRentPaidLog';
import { RequiredActionPostponedError } from './RequiredActionPostponedError';

export class PayPropertyRentAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: ActionType.PAY_PROPERTY_RENT, required: true });

        this._propertySpace = propertySpace;
    }

    perform(context: MoveContext): Log[] {
        const landlord = this._propertySpace.landlord;
        if (landlord === null) {
            throw new Error('Property is not owned by anybody');
        }

        const amount = this._propertySpace.calculateRent();

        if (!context.movePlayer.canPay(amount)) {
            throw new RequiredActionPostponedError();
        }

        context.movePlayer.charge(amount);
        landlord.topUp(amount);

        return [
            new PropertyRentPaidLog({
                landlord,
                tenant: context.movePlayer,
                propertySpace: this._propertySpace,
                amount,
            }),
        ];
    }
}
