import { Serializable, SerializableObject } from '../Serializable';
import { LandableSpace } from './LandableSpace';

export class LuxuryTaxSpace implements LandableSpace, Serializable {
    private _amount: number;

    constructor(attributes: { amount: number }) {
        this._amount = attributes.amount;
    }

    land(): void {}

    serialize(): SerializableObject {
        return { type: 'luxuryTax' };
    }
}
