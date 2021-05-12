import type { Player } from '../../Player';
import { Space } from '../Space';

export abstract class PropertySpace extends Space {
    protected _landlord: Player | null;
    protected _name: string;
    protected _price: number;

    constructor(attributes: {
        landlord: Player | null,
        type: string,
        name: string,
        price: number,
    }) {
        super({ type: attributes.type });

        this._landlord = attributes.landlord ?? null;
        this._name = attributes.name;
        this._price = attributes.price;
    }

    abstract calculateRent(): number;

    setLandlord(player: Player): void {
        this._landlord = player;
    }

    get price(): number {
        return this._price;
    }

    get landlord(): Player | null {
        return this._landlord;
    }
}
