import { Serializable, SerializableObject } from '../../utils/Serializable';
import { LandableSpace } from '../LandableSpace';
import { CommunityChestCard } from './CommunityChestCard';

export class CommunityChestSpace implements LandableSpace, Serializable {
    private _cards: CommunityChestCard[];

    constructor(attributes: {
        cards: CommunityChestCard[]
    }) {
        this._cards = attributes.cards;
    }

    land(): void {}

    serialize(): SerializableObject {
        return {
            type: 'communityChest',
            name: 'Community Chest',
        };
    }
}
