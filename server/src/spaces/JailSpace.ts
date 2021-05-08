import { Serializable, SerializableObject } from '../utils/Serializable';
import { LandableSpace } from './LandableSpace';

export class JailSpace implements LandableSpace, Serializable {
    land(): void {}

    serialize(): SerializableObject {
        return {
            type: 'jail',
            name: 'Jail',
        };
    }
}
