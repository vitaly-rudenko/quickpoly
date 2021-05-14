import type { PropertySpace } from '../map/properties/PropertySpace';
import { Log } from './Log';

export class PropertyMortgagedLog extends Log {
    private _propertySpace: PropertySpace;

    constructor(attributes: { propertySpace: PropertySpace }) {
        super({ type: 'propertyMortgaged' });

        this._propertySpace = attributes.propertySpace;
    }
}
