import { LandableSpace } from '../LandableSpace';

export abstract class PropertySpace implements LandableSpace {
    protected _name: string;
    protected _price: number;

    constructor(attributes: { name: string, price: number }) {
        this._name = attributes.name;
        this._price = attributes.price;
    }

    land(): void {}
}
