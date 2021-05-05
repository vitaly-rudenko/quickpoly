import { Serializable, SerializableObject } from '../../utils/Serializable';
import { PropertySpace } from './PropertySpace';

export class UtilitySpace extends PropertySpace implements Serializable {
    serialize(): SerializableObject {
        return {
            type: 'utility',
            attributes: {
                name: this._name,
                price: this._price,
            },
        };
    }
}
