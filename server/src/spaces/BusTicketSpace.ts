import { Serializable, SerializableObject } from '../utils/Serializable';
import { LandableSpace } from './LandableSpace';

export class BusTicketSpace implements LandableSpace, Serializable {
    land(): void {}

    serialize(): SerializableObject {
        return {
            type: 'busTicket',
            name: 'Bus Ticket',
        };
    }
}
