import { Action } from '../../actions/Action';
import { PurchasePropertyAction } from '../../actions/PurchasePropertyAction';
import { Context } from '../../Context';
import { Player } from '../../Player';
import { PropertySpace } from './PropertySpace';

export class StreetSpace extends PropertySpace {
    private _color: StreetColor;
    private _titleDeed: StreetTitleDeed;

    constructor(attributes: {
        owner: Player | null,
        name: string,
        price: number,
        color: StreetColor,
        titleDeed: StreetTitleDeed
    }) {
        super({
            type: 'streetSpace',
            owner: attributes.owner,
            name: attributes.name,
            price: attributes.price,
        });

        this._color = attributes.color;
        this._titleDeed = attributes.titleDeed;
    }

    calculateRent(): number {
        return this._titleDeed.baseRent;
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

    get baseRent(): number {
        return this._baseRent;
    }

    get perHouseRents(): number[] {
        return this._perHouseRents;
    }

    get hotelRent(): number {
        return this._hotelRent;
    }

    get mortgageValue(): number {
        return this._mortgageValue;
    }

    get housePrice(): number {
        return this._housePrice;
    }

    get hotelBasePrice(): number {
        return this._hotelBasePrice;
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
