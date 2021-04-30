import { LandableSpace } from '../LandableSpace';
import { CommunityChestCard } from './CommunityChestCard';

export class CommunityChestSpace implements LandableSpace {
    private _cards: CommunityChestCard[];

    constructor(attributes: {
        cards: CommunityChestCard[]
    }) {
        this._cards = attributes.cards;
    }

    land() {}
}
