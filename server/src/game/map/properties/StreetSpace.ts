import type { Context } from '../../Context';
import type { Player } from '../../Player';
import { Action } from '../../actions/Action';
import { PayPropertyRentAction } from '../../actions/PayPropertyRentAction';
import { PurchasePropertyAction } from '../../actions/PurchasePropertyAction';
import { PutPropertyUpForAuctionAction } from '../../actions/PutPropertyUpForAuctionAction';
import { RollDiceAction } from '../../actions/RollDiceAction';
import { PropertySpace } from './PropertySpace';

export class StreetSpace extends PropertySpace {
    private _color: StreetColor;
    private _titleDeed: StreetTitleDeed;
    private _houses: number;
    private _hotel: boolean;

    constructor(attributes: {
        name: string,
        price: number,
        color: StreetColor,
        landlord: Player | null,
        houses: number,
        hotel: boolean,
        titleDeed: StreetTitleDeed,
    }) {
        super({
            type: 'streetSpace',
            landlord: attributes.landlord,
            name: attributes.name,
            price: attributes.price,
        });

        this._color = attributes.color;
        this._titleDeed = attributes.titleDeed;
        this._houses = attributes.houses;
        this._hotel = attributes.hotel;
    }

    calculateRent(): number {
        return this._hotel
            ? this._titleDeed.hotelRent
            : this._houses > 0
                ? this._titleDeed.perHouseRents[this._houses]
                : this._titleDeed.baseRent;
    }

    getResidenceActions(context: Context): Action[] {
        const actions: Action[] = [];

        if (context.move.hasActionBeenPerformed('rollDice')) {
            if (this._landlord) {
                if (
                    this._landlord !== context.move.player &&
                    !context.move.hasActionBeenPerformed('payPropertyRent')
                ) {
                    actions.push(new PayPropertyRentAction(this));
                }
            } else {
                if (
                    context.move.player.canPay(this._price) &&
                    !context.move.hasActionBeenPerformed('purchaseProperty')
                ) {
                    actions.push(new PurchasePropertyAction(this));
                }

                actions.push(new PutPropertyUpForAuctionAction(this));
            }
        } else {
            actions.push(new RollDiceAction());
        }

        return actions;
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
