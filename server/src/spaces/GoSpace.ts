import { LandableSpace } from './LandableSpace';
import { PassableSpace } from '../PassableSpace';
import { Serializable, SerializableObject } from '../utils/Serializable';

export class GoSpace implements LandableSpace, PassableSpace, Serializable {
    private _salary: number;

    constructor(attributes: { salary: number }) {
        this._salary = attributes.salary;
    }

    land(): void {}

    pass(): void {}

    serialize(): SerializableObject {
        return {
            type: 'go',
            attributes: {
                salary: this._salary,
            },
        };
    }
}
