import { Serializable, SerializableObject } from '../Serializable';
import { LandableSpace } from './LandableSpace';

export class AuctionSpace implements LandableSpace, Serializable {
    land(): void {}

    serialize(): SerializableObject {
        return { type: 'auction' };
    }
}
