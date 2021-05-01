export interface Space {
    type: string,
    attributes?: {
        name?: string,
        price?: number,
        amount?: number,
        salary?: number,
        percent?: number,
        color?: string,
        titleDeed?: {
            baseRent: number,
            perHouseRents: number[],
            hotelRent: number,
            mortgageValue: number,
            housePrice: number,
            hotelBasePrice: number,
        },
    }
}
