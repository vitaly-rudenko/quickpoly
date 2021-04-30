import { LandableSpace } from './LandableSpace';
import { PassableSpace } from '../PassableSpace';

export class GoSpace implements LandableSpace, PassableSpace {
    private _salary: number;

    constructor(attributes: { salary: number }) {
        this._salary = attributes.salary;
    }

    land() {}

    pass() {}
}
