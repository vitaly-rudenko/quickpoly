import { Action } from '../../actions/Action';
import { PurchasePropertyAction } from '../../actions/PurchasePropertyAction';
import { PutPropertyUpForAuction } from '../../actions/PutPropertyUpForAuction';
import { Context } from '../../Context';
import { PropertySpace } from './PropertySpace';

export class StreetSpace extends PropertySpace {
    private _color: StreetColor;
    private _titleDeed: StreetTitleDeed;

    constructor(attributes: {
        name: string,
        price: number,
        color: StreetColor,
        titleDeed: StreetTitleDeed
    }) {
        super({
            type: 'streetSpace',
            name: attributes.name,
            price: attributes.price,
        });

        this._color = attributes.color;
        this._titleDeed = attributes.titleDeed;
    }

    getActions(context: Context): Action[] {
        return [
            new PurchasePropertyAction(this),
            new PutPropertyUpForAuction(this),
        ];
    }
}

export class StreetTitleDeed {
    private _baseRent: number;
    private _perHouseRents: number[];
    private _hotelRent: number;
    private _mortgageValue: number;
    private _housePrice: number;
    private _hotelBasePrice: number;

    constructor(attributes: {
        baseRent: number,
        perHouseRents: number[],
        hotelRent: number,
        mortgageValue: number,
        housePrice: number,
        hotelBasePrice: number,
    }) {
        this._baseRent = attributes.baseRent;
        this._perHouseRents = attributes.perHouseRents;
        this._hotelRent = attributes.hotelRent;
        this._mortgageValue = attributes.mortgageValue;
        this._housePrice = attributes.housePrice;
        this._hotelBasePrice = attributes.hotelBasePrice;
    }
}

export enum StreetColor {
    BROWN = 'brown',
    LIGHT_BLUE = 'lightBlue',
    PINK = 'pink',
    ORANGE = 'orange',
    RED = 'red',
    YELLOW = 'yellow',
    GREEN = 'green',
    BLUE = 'blue'
}
