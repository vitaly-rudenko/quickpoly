import type { StreetSpace } from '../map/properties/StreetSpace';
import { Player } from '../Player';
import { Log } from './Log';

export class StreetSpaceDowngradedLog extends Log {
    private _landlord: Player;
    private _streetSpace: StreetSpace;
    private _refund: number;

    constructor(attributes: {
        landlord: Player,
        streetSpace: StreetSpace,
        refund: number,
    }) {
        super({ type: 'streetSpaceDowngraded' });

        this._landlord = attributes.landlord;
        this._streetSpace = attributes.streetSpace;
        this._refund = attributes.refund;
    }
}
