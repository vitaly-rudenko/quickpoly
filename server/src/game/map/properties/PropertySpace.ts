import { Player } from '../../Player';
import { Space } from '../Space';

export abstract class PropertySpace extends Space {
    private _name: string;
    private _price: number;
    private _ownerId: string | null;

    constructor(attributes: { type: string, name: string, price: number }) {
        super({ type: attributes.type });

        this._name = attributes.name;
        this._price = attributes.price;
        this._ownerId = null;
    }

    makeOwner(player: Player): void {
        this._ownerId = player.id;
    }

    get price(): number {
        return this._price;
    }

    get ownerId(): string | null {
        return this._ownerId;
    }
}
