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
    name: string;
}

export interface BirthdayGiftSpace {
    type: 'birthdayGift';
    name: string;
}

export interface BusTicketSpace {
    type: 'busTicket';
    name: string;
    attributes: { amount: number };
}

export interface GoSpace {
    type: 'go';
    name: string;
    attributes: { salary: number };
}

export interface GoToJailSpace {
    type: 'goToJail';
    name: string;
}

export interface IncomeTaxSpace {
    type: 'incomeTax';
    name: string;
    attributes: { amount: number, percent: number };
}

export interface JailSpace {
    type: 'jail';
    name: string;
}

export interface LuxuryTaxSpace {
    type: 'luxuryTax';
    name: string;
    attributes: { amount: number };
}

export interface ChanceSpace {
    type: 'chance';
    name: string;
}

export interface CommunityChestSpace {
    type: 'communityChest';
    name: string;
}

export interface RailroadSpace {
    type: 'railroad';
    name: string;
    attributes: {
        price: number,
    };
}

export interface StreetSpace {
    type: 'street';
    name: string;
    attributes: {
        price: number,
        color: StreetColor,
        titleDeed: StreetTitleDeed,
    };
}

export interface UtilitySpace {
    type: 'utility';
    name: string;
    attributes: {
        price: number,
    };
}

export interface FreeParkingSpace {
    type: 'freeParking';
    name: string;
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
