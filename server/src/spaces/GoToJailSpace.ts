import { Serializable, SerializableObject } from '../utils/Serializable';
import { LandableSpace } from './LandableSpace';

export class GoToJailSpace implements LandableSpace, Serializable {
    land(): void {}

    serialize(): SerializableObject {
        return {
            type: 'goToJail',
            name: 'Go to Jail',
        };
    }
}
