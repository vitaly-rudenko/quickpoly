import type { PropertySpace } from '../map/properties/PropertySpace';
import { Player } from '../Player';
import { Log } from './Log';

export class PropertyMortgagedLog extends Log {
    private _landlord: Player;
    private _propertySpace: PropertySpace;
    private _mortgageValue: number;

    constructor(attributes: {
        landlord: Player,
        propertySpace: PropertySpace,
        mortgageValue: number,
    }) {
        super({ type: 'propertyMortgaged' });

        this._landlord = attributes.landlord;
        this._propertySpace = attributes.propertySpace;
        this._mortgageValue = attributes.mortgageValue;
    }
}
