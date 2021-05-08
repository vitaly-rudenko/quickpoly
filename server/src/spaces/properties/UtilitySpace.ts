import { Serializable, SerializableObject } from '../../utils/Serializable';
import { PropertySpace } from './PropertySpace';

export class UtilitySpace extends PropertySpace implements Serializable {
    serialize(): SerializableObject {
        return {
            type: 'utility',
            name: this._name,
            attributes: {
                price: this._price,
            },
        };
    }
}
