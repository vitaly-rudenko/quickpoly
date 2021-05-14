import type { PropertySpace } from '../map/properties/PropertySpace';
import type { Context } from '../Context';
import { Action } from './Action';
import { PropertyMortgagedLog } from '../logs/PropertyMortgagedLog';
import { Player } from '../Player';

interface MortgagePropertyActionData {
    propertySpace: PropertySpace;
}

export class MortgagePropertyAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: 'mortgageProperty' });
        this._propertySpace = propertySpace;
    }

    perform(context: Context): boolean {
        const landlord = this._propertySpace.landlord;
        if (!landlord) {
            return false;
        }

        const mortgageValue = this._propertySpace.calculateMortgageValue();

        this._propertySpace.mortgage();
        landlord.topUp(mortgageValue);

        context.log(
            new PropertyMortgagedLog({
                propertySpace: this._propertySpace
            })
        );

        return true;
    }

    applies(data?: MortgagePropertyActionData): boolean {
        return data?.propertySpace === this._propertySpace;
    }
}
