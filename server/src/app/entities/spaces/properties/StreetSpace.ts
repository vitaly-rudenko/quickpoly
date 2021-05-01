import { StreetTitleDeed } from './StreetTitleDeed';
import { PropertySpace } from './PropertySpace';
import { Serializable, SerializableObject } from '../../Serializable';
import { StreetColor } from './StreetColor';

export class StreetSpace extends PropertySpace implements Serializable {
    private _color: StreetColor;
    private _titleDeed: StreetTitleDeed;

    constructor(attributes: {
        name: string,
        price: number,
        color: StreetColor,
        titleDeed: StreetTitleDeed
    }) {
        super({
            name: attributes.name,
            price: attributes.price,
        });

        this._color = attributes.color;
        this._titleDeed = attributes.titleDeed;
    }

    serialize(): SerializableObject {
        return {
            type: 'utility',
            attributes: {
                name: this._name,
                price: this._price,
                color: this._color,
                titleDeed: this._titleDeed.serialize(),
            },
        };
    }
}
