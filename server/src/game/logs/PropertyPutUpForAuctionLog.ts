import type { PropertySpace } from '../map/properties/PropertySpace';
import { Log } from './Log';

export class PropertyPutUpForAuctionLog extends Log {
    private _propertySpace: PropertySpace;

    constructor(attributes: { propertySpace: PropertySpace }) {
        super({ type: 'propertyPutUpForAuction' });

        this._propertySpace = attributes.propertySpace;
    }
}
