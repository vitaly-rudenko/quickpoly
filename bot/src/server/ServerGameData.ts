export interface ServerGameData {
    spaces: Space[]
}

export type Space = (
    AuctionSpace |
    BirthdayGiftSpace |
    BusTicketSpace |
    FreeParkingSpace |
    GoSpace |
    GoToJailSpace |
    IncomeTaxSpace |
    JailSpace |
    LuxuryTaxSpace |
    ChanceSpace |
    CommunityChestSpace |
    RailroadSpace |
    StreetSpace |
    UtilitySpace
);

export interface AuctionSpace {
    type: 'auction';
}

export interface BirthdayGiftSpace {
    type: 'birthdayGift';
}

export interface BusTicketSpace {
    type: 'busTicket';
    attributes: { amount: number };
}

export interface GoSpace {
    type: 'go';
    attributes: { salary: number };
}

export interface GoToJailSpace {
    type: 'goToJail';
}

export interface IncomeTaxSpace {
    type: 'incomeTax';
    attributes: { amount: number, percent: number };
}

export interface JailSpace {
    type: 'jail';
}

export interface LuxuryTaxSpace {
    type: 'luxuryTax';
    attributes: { amount: number };
}

export interface ChanceSpace {
    type: 'chance';
}

export interface CommunityChestSpace {
    type: 'communityChest';
}

export interface RailroadSpace {
    type: 'railroad';
    attributes: {
        name: string,
        price: number,
    };
}

export interface StreetSpace {
    type: 'street';
    attributes: {
        name: string,
        price: number,
        color: StreetColor,
        titleDeed: StreetTitleDeed,
    };
}

export interface UtilitySpace {
    type: 'utility';
    attributes: {
        name: string,
        price: number,
    };
}

export interface FreeParkingSpace {
    type: 'freeParking';
}

export interface StreetTitleDeed {
    baseRent: number;
    perHouseRents: number[];
    hotelRent: number;
    mortgageValue: number;
    housePrice: number;
    hotelBasePrice: number;
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
