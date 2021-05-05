import { Serializable, SerializableObject } from '../Serializable';
import { LandableSpace } from './LandableSpace';

export class GoToJailSpace implements LandableSpace, Serializable {
    land(): void {}

    serialize(): SerializableObject {
        return { type: 'goToJail' };
    }
}
