import { LandableSpace } from '../LandableSpace';

export abstract class PropertySpace implements LandableSpace {
    private _name: string;
    private _price: number;

    constructor(attributes: { name: string, price: number }) {
        this._name = attributes.name;
        this._price = attributes.price;
    }

    abstract land(): void;
}
