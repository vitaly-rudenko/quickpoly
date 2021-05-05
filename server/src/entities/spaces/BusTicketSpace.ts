import { Serializable, SerializableObject } from '../Serializable';
import { LandableSpace } from './LandableSpace';

export class BusTicketSpace implements LandableSpace, Serializable {
    land(): void {}

    serialize(): SerializableObject {
        return { type: 'busTicket' };
    }
}
