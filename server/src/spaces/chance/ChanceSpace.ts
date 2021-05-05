import { Serializable, SerializableObject } from '../../utils/Serializable';
import { LandableSpace } from '../LandableSpace';
import { ChanceCard } from './ChanceCard';

export class ChanceSpace implements LandableSpace, Serializable {
    private _cards: ChanceCard[];

    constructor(attributes: {
        cards: ChanceCard[]
    }) {
        this._cards = attributes.cards;
    }

    land(): void {}

    serialize(): SerializableObject {
        return { type: 'chance' };
    }
}
