import { Serializable, SerializableObject } from '../../utils/Serializable';
import { PropertySpace } from './PropertySpace';

export class RailroadSpace extends PropertySpace implements Serializable {
    serialize(): SerializableObject {
        return {
            type: 'railroad',
            name: this._name,
            attributes: {
                price: this._price,
            },
        };
    }
}
