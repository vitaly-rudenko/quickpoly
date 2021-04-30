import { LandableSpace } from './LandableSpace';

export class LuxuryTaxSpace implements LandableSpace {
    private _amount: number;

    constructor(attributes: { amount: number }) {
        this._amount = attributes.amount;
    }
}
