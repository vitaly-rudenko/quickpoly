import type { Context } from '../../Context';
import type { Player } from '../../Player';
import type { Action } from '../../actions/Action';
import { PropertySpace } from './PropertySpace';
import { UpgradeStreetSpaceAction } from '../../actions/UpgradeStreetSpaceAction';
import { DowngradeStreetSpaceAction } from '../../actions/DowngradeStreetSpaceAction';

const MAX_HOUSES = 4;

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

    canBeMortgaged(): boolean {
        return !this._hotel && this._houses === 0;
    }

    calculateMortgageValue(): number {
        return this._titleDeed.mortgageValue;
    }

    getTypeSpecificGlobalActions(context: Context): Action[] {
        const actions: Action[] = [];

        if (
            this.canBeUpgraded() &&
            this._landlord === context.move.player &&
            context.move.player.canPay(this.calculateUpgradePrice())
        ) {
            const streetSpaces = context.map.filter(s => s instanceof StreetSpace) as StreetSpace[];
            const isMonopoly = streetSpaces
                .filter(s => s.color === this._color)
                .every(s => s.landlord === context.move.player);

            if (isMonopoly) {
                actions.push(new UpgradeStreetSpaceAction({ streetSpace: this }));
            }
        }

        // if (
        //     this.canBeDowngraded() &&
        //     this._landlord === context.move.player
        // ) {
        //     actions.push(new DowngradeStreetSpaceAction(this));
        // }

        return actions;
    }

    canBeUpgraded(): boolean {
        return !this._hotel;
    }

    upgrade(): void {
        if (!this._landlord) return;
        if (this._houses === MAX_HOUSES) {
            this._houses = 0;
            this._hotel = true;
        } else {
            this._houses++;
        }
    }

    calculateUpgradePrice(): number {
        return this._houses === MAX_HOUSES
            ? this._titleDeed.hotelPrice
            : this._titleDeed.housePrice;
    }

    canBeDowngraded(): boolean {
        return this._hotel || this._houses > 0;
    }

    downgrade(): void {
        if (!this._landlord) return;
        if (this._hotel) {
            this._hotel = false;
            this._houses = 4;
        } else if (this._houses > 0) {
            this._houses--;
        }
    }

    calculateDowngradeRefund(): number {
        return this._hotel
            ? this._titleDeed.hotelPrice / 2
            : this._titleDeed.housePrice / 2;
    }

    get color(): StreetColor {
        return this._color;
    }

    get houses(): number {
        return this._houses;
    }

    get hotel(): boolean {
        return this._hotel;
    }
}

export class StreetTitleDeed {
    private _baseRent: number;
    private _perHouseRents: number[];
    private _hotelRent: number;
    private _mortgageValue: number;
    private _housePrice: number;
    private _hotelPrice: number;

    constructor(attributes: {
        baseRent: number,
        perHouseRents: number[],
        hotelRent: number,
        mortgageValue: number,
        housePrice: number,
        hotelPrice: number,
    }) {
        this._baseRent = attributes.baseRent;
        this._perHouseRents = attributes.perHouseRents;
        this._hotelRent = attributes.hotelRent;
        this._mortgageValue = attributes.mortgageValue;
        this._housePrice = attributes.housePrice;
        this._hotelPrice = attributes.hotelPrice;
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

    get hotelPrice(): number {
        return this._hotelPrice;
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
