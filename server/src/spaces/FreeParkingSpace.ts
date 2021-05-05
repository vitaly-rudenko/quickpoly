import { Serializable, SerializableObject } from '../utils/Serializable';
import { LandableSpace } from './LandableSpace';

export class FreeParkingSpace implements LandableSpace, Serializable {
    land(): void {}

    serialize(): SerializableObject {
        return { type: 'freeParking' };
    }
}
