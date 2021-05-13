import type { StreetSpace } from '../map/properties/StreetSpace';
import { Player } from '../Player';
import { Log } from './Log';

export class StreetSpaceUpgradedLog extends Log {
    private _landlord: Player;
    private _streetSpace: StreetSpace;
    private _price: number;

    constructor(attributes: {
        landlord: Player,
        streetSpace: StreetSpace,
        price: number,
    }) {
        super({ type: 'streetSpaceUpgraded' });

        this._landlord = attributes.landlord;
        this._streetSpace = attributes.streetSpace;
        this._price = attributes.price;
    }
}
