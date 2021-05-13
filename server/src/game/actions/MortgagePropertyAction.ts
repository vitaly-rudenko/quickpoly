import type { PropertySpace } from '../map/properties/PropertySpace';
import type { Context } from '../Context';
import { Action } from './Action';

interface MortgagePropertyActionData {
    propertySpace: PropertySpace;
}

export class MortgagePropertyAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: 'mortgagePropertyAction' });
        this._propertySpace = propertySpace;
    }

    perform(context: Context): boolean {
        this._propertySpace.mortgage();
        return true;
    }

    applies(data?: MortgagePropertyActionData): boolean {
        return data?.propertySpace === this._propertySpace;
    }
}
