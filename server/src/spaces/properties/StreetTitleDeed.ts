import { Serializable, SerializableObject } from '../../utils/Serializable';

export class StreetTitleDeed implements Serializable {
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

    serialize(): SerializableObject {
        return {
            baseRent: this._baseRent,
            perHouseRents: this._perHouseRents,
            hotelRent: this._hotelRent,
            mortgageValue: this._mortgageValue,
            housePrice: this._housePrice,
            hotelBasePrice: this._hotelBasePrice,
        };
    }
}
