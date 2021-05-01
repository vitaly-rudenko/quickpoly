import { Serializable, SerializableObject } from '../Serializable';
import { LandableSpace } from './LandableSpace';

export class JailSpace implements LandableSpace, Serializable {
    land(): void {}

    serialize(): SerializableObject {
        return { type: 'jail' };
    }
}
