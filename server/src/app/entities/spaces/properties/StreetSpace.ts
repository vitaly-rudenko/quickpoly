import { StreetTitleDeed } from './StreetTitleDeed';
import { PropertySpace } from './PropertySpace';

export class StreetSpace extends PropertySpace {
    private _titleDeed: StreetTitleDeed;

    constructor(attributes: {
        name: string,
        price: number,
        color: string,
        titleDeed: StreetTitleDeed
    }) {
        super({
            name: attributes.name,
            price: attributes.price,
        });

        this._titleDeed = attributes.titleDeed;
    }
}
