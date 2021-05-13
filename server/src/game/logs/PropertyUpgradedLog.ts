import type { StreetSpace } from '../map/properties/StreetSpace';
import { Player } from '../Player';
import { Log } from './Log';

export class PropertyUpgradedLog extends Log {
    private _player: Player;
    private _streetSpace: StreetSpace;
    private _price: number;

    constructor(attributes: {
        player: Player,
        streetSpace: StreetSpace,
        price: number,
    }) {
        super({ type: 'propertyUpgraded' });

        this._player = attributes.player;
        this._streetSpace = attributes.streetSpace;
        this._price = attributes.price;
    }
}
