import type { PropertySpace } from '../map/properties/PropertySpace';
import { Player } from '../Player';
import { Log } from './Log';

export class PropertyRentPaidLog extends Log {
    private _tenant: Player;
    private _landlord: Player;
    private _propertySpace: PropertySpace;
    private _amount: number;

    constructor(attributes: {
        tenant: Player,
        landlord: Player,
        propertySpace: PropertySpace,
        amount: number,
    }) {
        super({ type: 'propertyRentPaid' });

        this._tenant = attributes.tenant;
        this._landlord = attributes.landlord;
        this._propertySpace = attributes.propertySpace;
        this._amount = attributes.amount;
    }
}
