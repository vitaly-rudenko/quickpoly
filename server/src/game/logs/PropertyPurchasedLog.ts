import type { PropertySpace } from '../map/properties/PropertySpace';
import { Player } from '../Player';
import { Log } from './Log';

export class PropertyPurchasedLog extends Log {
    private _player: Player;
    private _propertySpace: PropertySpace;

    constructor(attributes: { player: Player, propertySpace: PropertySpace }) {
        super({ type: 'propertyPurchased' });

        this._player = attributes.player;
        this._propertySpace = attributes.propertySpace;
    }
}
