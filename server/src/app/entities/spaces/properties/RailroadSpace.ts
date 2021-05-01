import { Serializable, SerializableObject } from '../../Serializable';
import { PropertySpace } from './PropertySpace';

export class RailroadSpace extends PropertySpace implements Serializable {
    serialize(): SerializableObject {
        return {
            type: 'railroadSpace',
            attributes: {
                name: this._name,
                price: this._price,
            },
        };
    }
}
