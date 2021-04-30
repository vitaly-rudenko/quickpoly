import { LandableSpace } from '../LandableSpace';
import { ChanceCard } from './ChanceCard';

export class ChanceSpace implements LandableSpace {
    private _cards: ChanceCard[];

    constructor(attributes: {
        cards: ChanceCard[]
    }) {
        this._cards = attributes.cards;
    }

    land() {}
}
