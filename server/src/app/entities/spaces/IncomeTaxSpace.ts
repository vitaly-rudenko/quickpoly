import { LandableSpace } from './LandableSpace';

export class IncomeTaxSpace implements LandableSpace {
    private _amount: number;
    private _percent: number;

    constructor(attributes: { amount: number, percent: number }) {
        this._amount = attributes.amount;
        this._percent = attributes.percent;
    }

    land() {}
}
