import type { PropertySpace } from './map/properties/PropertySpace';

export class Auction {
    private _propertySpace: PropertySpace;

    constructor(attributes: {
        propertySpace: PropertySpace,
    }) {
        this._propertySpace = attributes.propertySpace;
    }
}
