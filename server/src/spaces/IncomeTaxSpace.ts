import { Serializable, SerializableObject } from '../utils/Serializable';
import { LandableSpace } from './LandableSpace';

export class IncomeTaxSpace implements LandableSpace, Serializable {
    private _amount: number;
    private _percent: number;

    constructor(attributes: { amount: number, percent: number }) {
        this._amount = attributes.amount;
        this._percent = attributes.percent;
    }

    land(): void {}

    serialize(): SerializableObject {
        return {
            type: 'incomeTax',
            attributes: {
                amount: this._amount,
                percent: this._percent,
            },
        };
    }
}
