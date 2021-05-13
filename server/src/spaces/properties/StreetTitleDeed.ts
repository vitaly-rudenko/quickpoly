import { Serializable, SerializableObject } from '../../utils/Serializable';

export class StreetTitleDeed implements Serializable {
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

    serialize(): SerializableObject {
        return {
            baseRent: this._baseRent,
            perHouseRents: this._perHouseRents,
            hotelRent: this._hotelRent,
            mortgageValue: this._mortgageValue,
            housePrice: this._housePrice,
            hotelPrice: this._hotelPrice,
        };
    }
}
