import { PropertySpace } from '../map/properties/PropertySpace';
import { Action } from './Action';

export class PutPropertyUpForAuction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: 'putPropertyUpForAuction' });

        this._propertySpace = propertySpace;
    }
}
