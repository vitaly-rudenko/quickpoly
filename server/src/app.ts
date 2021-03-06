import { CommunityChestSpace } from './app/entities/spaces/community-chest/CommunityChestSpace';
import { GoSpace } from './app/entities/spaces/GoSpace';
import { StreetSpace } from './app/entities/spaces/properties/StreetSpace';
import { StreetColor } from './app/entities/spaces/properties/StreetColor';
import { StreetTitleDeed } from './app/entities/spaces/properties/StreetTitleDeed';
import { IncomeTaxSpace } from './app/entities/spaces/IncomeTaxSpace';
import { RailroadSpace } from './app/entities/spaces/properties/RailroadSpace';
import { UtilitySpace } from './app/entities/spaces/properties/UtilitySpace';
import { AuctionSpace } from './app/entities/spaces/AuctionSpace';
import { FreeParkingSpace } from './app/entities/spaces/FreeParkingSpace';
import { ChanceSpace } from './app/entities/spaces/chance/ChanceSpace';
import { BusTicketSpace } from './app/entities/spaces/BusTicketSpace';
import { JailSpace } from './app/entities/spaces/JailSpace';
import { GoToJailSpace } from './app/entities/spaces/GoToJailSpace';
import { BirthdayGiftSpace } from './app/entities/spaces/BirthdayGiftSpace';
import { LuxuryTaxSpace } from './app/entities/spaces/LuxuryTaxSpace';

const communityChestSpace = new CommunityChestSpace({
    cards: [
        {
            name: 'Advance to "Go" (Collect $200)',
            act() {},
        },
        {
            name: 'Bank error in your favor (Collect $200)',
            act() {},
        },
        {
            name: 'Doctor\'s fees (Pay $50)',
            act() {},
        },
        {
            name: 'From sale of stock you get $50',
            act() {},
        },
        {
            name: 'Get Out of Jail Free (May be kept until needed or sold/traded)',
            act() {},
        },
        {
            name: 'Go to Jail (Do not pass Go, Do not collect $200)',
            act() {},
        },
        {
            name: 'Grand Opera Night (Collect $50 from every player)',
            act() {},
        },
        {
            name: 'Holiday Fund matures (Collect $100)',
            act() {},
        },
        {
            name: 'Income tax refund (Collect $20)',
            act() {},
        },
        {
            name: 'It\'s your birthday (Collect $10 from every player)',
            act() {},
        },
        {
            name: 'Life insurance matures (Collect $100)',
            act() {},
        },
        {
            name: 'Hospital Fees (Pay $50)',
            act() {},
        },
        {
            name: 'School Fees (Pay $50)',
            act() {},
        },
        {
            name: 'Receive $25 consultancy fee (Collect $25)',
            act() {},
        },
        {
            name: 'You are assessed for street repairs (Pay $40 per house and $115 per hotel of you own)',
            act() {},
        },
        {
            name: 'You have won second prize in a beauty contest (Collect $10)',
            act() {},
        },
        {
            name: 'You inherit $100',
            act() {},
        },
    ],
});

const chanceSpace = new ChanceSpace({
    cards: [
        {
            name: 'Advance to "Go" (Collect $200)',
            act() {},
        },
        {
            name: 'Advance to Illinois Avenue (If you pass Go, Collect $200)',
            act() {},
        },
        {
            name: 'Advance to St. Charles Place (If you pass Go, Collect $200)',
            act() {},
        },
        {
            name: 'Advance token to the nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total 10 times the amount thrown. ',
            act() {},
        },
        {
            name: 'Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the re tal to which they are otherwise entitled. If Railroad is unowned, you may buy it from the Bank.',
            act() {},
        },
        {
            name: 'Bank pays you dividend of $50.',
            act() {},
        },
        {
            name: 'Get out of Jail Free. This card may be kept until needed, or traded/sold.',
            act() {},
        },
        {
            name: 'Go Back 3 Spaces.',
            act() {},
        },
        {
            name: 'Go to Jail. Do not pass GO, do not collect $200.',
            act() {},
        },
        {
            name: 'Make general repairs on all your property: For each house pay $25, For each hotel pay $100.',
            act() {},
        },
        {
            name: 'Pay poor tax of $15',
            act() {},
        },
        {
            name: 'Take a trip to Reading Railroad.',
            act() {},
        },
        {
            name: 'Take a walk on the Boardwalk.',
            act() {},
        },
        {
            name: 'You have been elected Chairman of the Board. Pay each player $50.',
            act() {},
        },
        {
            name: 'Your building and loan matures. Collect $150.',
            act() {},
        },
        {
            name: 'You have won a crossword competition. Collect $100.',
            act() {},
        },
    ],
});

const spaces = [
    new GoSpace({ salary: 200 }),
    new StreetSpace({
        name: 'Mediterranean Avenue',
        price: 60,
        color: StreetColor.BROWN,
        titleDeed: new StreetTitleDeed({
            baseRent: 2,
            perHouseRents: [10, 30, 90, 160],
            hotelRent: 250,
            mortgageValue: 30,
            housePrice: 50,
            hotelBasePrice: 50,
        }),
    }),
    communityChestSpace,
    new StreetSpace({
        name: 'Baltic Avenue',
        price: 60,
        color: StreetColor.BROWN,
        titleDeed: new StreetTitleDeed({
            baseRent: 4,
            perHouseRents: [20, 60, 180, 320],
            hotelRent: 450,
            mortgageValue: 30,
            housePrice: 50,
            hotelBasePrice: 50,
        }),
    }),
    new StreetSpace({
        name: 'Arctic Avenue',
        price: 80,
        color: StreetColor.BROWN,
        titleDeed: new StreetTitleDeed({
            baseRent: 5,
            perHouseRents: [30, 80, 240, 360],
            hotelRent: 450,
            mortgageValue: 40,
            housePrice: 50,
            hotelBasePrice: 50,
        }),
    }),
    new IncomeTaxSpace({
        amount: 200,
        percent: 10,
    }),
    new RailroadSpace({
        name: 'Reading Railroad',
        price: 200,
    }),
    new StreetSpace({
        name: 'Massachusetts Avenue',
        price: 100,
        color: StreetColor.LIGHT_BLUE,
        titleDeed: new StreetTitleDeed({
            baseRent: 6,
            perHouseRents: [30, 90, 270, 400],
            hotelRent: 550,
            mortgageValue: 50,
            housePrice: 50,
            hotelBasePrice: 50,
        }),
    }),
    new StreetSpace({
        name: 'Oriental Avenue',
        price: 100,
        color: StreetColor.LIGHT_BLUE,
        titleDeed: new StreetTitleDeed({
            baseRent: 6,
            perHouseRents: [30, 90, 270, 400],
            hotelRent: 550,
            mortgageValue: 50,
            housePrice: 50,
            hotelBasePrice: 50,
        }),
    }),
    chanceSpace,
    new UtilitySpace({
        name: 'Gas Company',
        price: 150,
    }),
    new StreetSpace({
        name: 'Vermont Avenue',
        price: 100,
        color: StreetColor.LIGHT_BLUE,
        titleDeed: new StreetTitleDeed({
            baseRent: 6,
            perHouseRents: [30, 90, 270, 400],
            hotelRent: 550,
            mortgageValue: 50,
            housePrice: 50,
            hotelBasePrice: 50,
        }),
    }),
    new JailSpace(),
    new AuctionSpace(),
    new StreetSpace({
        name: 'Maryland Avenue',
        price: 140,
        color: StreetColor.PINK,
        titleDeed: new StreetTitleDeed({
            baseRent: 10,
            perHouseRents: [50, 150, 450, 625],
            hotelRent: 750,
            mortgageValue: 70,
            housePrice: 100,
            hotelBasePrice: 100,
        }),
    }),
    new StreetSpace({
        name: 'St. Charles Place',
        price: 140,
        color: StreetColor.PINK,
        titleDeed: new StreetTitleDeed({
            baseRent: 10,
            perHouseRents: [50, 150, 450, 625],
            hotelRent: 750,
            mortgageValue: 70,
            housePrice: 100,
            hotelBasePrice: 100,
        }),
    }),
    new UtilitySpace({
        name: 'Electric Company',
        price: 150,
    }),
    new StreetSpace({
        name: 'States Avenue',
        price: 140,
        color: StreetColor.PINK,
        titleDeed: new StreetTitleDeed({
            baseRent: 10,
            perHouseRents: [50, 150, 450, 625],
            hotelRent: 750,
            mortgageValue: 70,
            housePrice: 100,
            hotelBasePrice: 100,
        }),
    }),
    new StreetSpace({
        name: 'Virginia Avenue',
        price: 160,
        color: StreetColor.PINK,
        titleDeed: new StreetTitleDeed({
            baseRent: 12,
            perHouseRents: [60, 180, 500, 700],
            hotelRent: 900,
            mortgageValue: 80,
            housePrice: 100,
            hotelBasePrice: 100,
        }),
    }),
    new RailroadSpace({
        name: 'Pennsylvania Railroad',
        price: 200,
    }),
    new StreetSpace({
        name: 'St. James Place',
        price: 180,
        color: StreetColor.ORANGE,
        titleDeed: new StreetTitleDeed({
            baseRent: 14,
            perHouseRents: [70, 200, 550, 750],
            hotelRent: 950,
            mortgageValue: 90,
            housePrice: 100,
            hotelBasePrice: 100,
        }),
    }),
    communityChestSpace,
    new StreetSpace({
        name: 'Tennessee Avenue',
        price: 180,
        color: StreetColor.ORANGE,
        titleDeed: new StreetTitleDeed({
            baseRent: 14,
            perHouseRents: [70, 200, 550, 750],
            hotelRent: 950,
            mortgageValue: 90,
            housePrice: 100,
            hotelBasePrice: 100,
        }),
    }),
    new StreetSpace({
        name: 'New York Avenue',
        price: 200,
        color: StreetColor.ORANGE,
        titleDeed: new StreetTitleDeed({
            baseRent: 16,
            perHouseRents: [80, 220, 600, 800],
            hotelRent: 1000,
            mortgageValue: 100,
            housePrice: 100,
            hotelBasePrice: 100,
        }),
    }),
    new StreetSpace({
        name: 'New Jersey Avenue',
        price: 200,
        color: StreetColor.ORANGE,
        titleDeed: new StreetTitleDeed({
            baseRent: 16,
            perHouseRents: [80, 220, 600, 800],
            hotelRent: 1000,
            mortgageValue: 100,
            housePrice: 100,
            hotelBasePrice: 100,
        }),
    }),
    new FreeParkingSpace(),
    new StreetSpace({
        name: 'Kentucky Avenue',
        price: 220,
        color: StreetColor.RED,
        titleDeed: new StreetTitleDeed({
            baseRent: 18,
            perHouseRents: [90, 250, 700, 875],
            hotelRent: 1050,
            mortgageValue: 110,
            housePrice: 150,
            hotelBasePrice: 150,
        }),
    }),
    chanceSpace,
    new StreetSpace({
        name: 'Indiana Avenue',
        price: 220,
        color: StreetColor.RED,
        titleDeed: new StreetTitleDeed({
            baseRent: 18,
            perHouseRents: [90, 250, 700, 875],
            hotelRent: 1050,
            mortgageValue: 110,
            housePrice: 150,
            hotelBasePrice: 150,
        }),
    }),
    new StreetSpace({
        name: 'Illinois Avenue',
        price: 240,
        color: StreetColor.RED,
        titleDeed: new StreetTitleDeed({
            baseRent: 20,
            perHouseRents: [100, 300, 750, 925],
            hotelRent: 1100,
            mortgageValue: 120,
            housePrice: 150,
            hotelBasePrice: 150,
        }),
    }),
    new StreetSpace({
        name: 'Michigan Avenue',
        price: 240,
        color: StreetColor.RED,
        titleDeed: new StreetTitleDeed({
            baseRent: 20,
            perHouseRents: [100, 300, 750, 925],
            hotelRent: 1100,
            mortgageValue: 120,
            housePrice: 150,
            hotelBasePrice: 150,
        }),
    }),
    new BusTicketSpace(),
    new RailroadSpace({
        name: 'B. & O. Railroad',
        price: 200,
    }),
    new StreetSpace({
        name: 'Atlantic Avenue',
        price: 260,
        color: StreetColor.YELLOW,
        titleDeed: new StreetTitleDeed({
            baseRent: 22,
            perHouseRents: [110, 330, 800, 975],
            hotelRent: 1150,
            mortgageValue: 130,
            housePrice: 150,
            hotelBasePrice: 150,
        }),
    }),
    new StreetSpace({
        name: 'Ventnor Avenue',
        price: 260,
        color: StreetColor.YELLOW,
        titleDeed: new StreetTitleDeed({
            baseRent: 22,
            perHouseRents: [110, 330, 800, 975],
            hotelRent: 1150,
            mortgageValue: 130,
            housePrice: 150,
            hotelBasePrice: 150,
        }),
    }),
    new UtilitySpace({
        name: 'Water Works',
        price: 150,
    }),
    new StreetSpace({
        name: 'Marvin Gardens',
        price: 280,
        color: StreetColor.YELLOW,
        titleDeed: new StreetTitleDeed({
            baseRent: 24,
            perHouseRents: [120, 360, 850, 1025],
            hotelRent: 1200,
            mortgageValue: 140,
            housePrice: 150,
            hotelBasePrice: 150,
        }),
    }),
    new StreetSpace({
        name: 'California Avenue',
        price: 280,
        color: StreetColor.YELLOW,
        titleDeed: new StreetTitleDeed({
            baseRent: 24,
            perHouseRents: [120, 360, 850, 1025],
            hotelRent: 1200,
            mortgageValue: 140,
            housePrice: 150,
            hotelBasePrice: 150,
        }),
    }),
    new GoToJailSpace(),
    new StreetSpace({
        name: 'Pacific Avenue',
        price: 300,
        color: StreetColor.GREEN,
        titleDeed: new StreetTitleDeed({
            baseRent: 26,
            perHouseRents: [130, 390, 900, 1100],
            hotelRent: 1275,
            mortgageValue: 150,
            housePrice: 200,
            hotelBasePrice: 200,
        }),
    }),
    new StreetSpace({
        name: 'South Carolina Avenue',
        price: 300,
        color: StreetColor.GREEN,
        titleDeed: new StreetTitleDeed({
            baseRent: 26,
            perHouseRents: [130, 390, 900, 1100],
            hotelRent: 1275,
            mortgageValue: 150,
            housePrice: 200,
            hotelBasePrice: 200,
        }),
    }),
    new StreetSpace({
        name: 'North Carolina Avenue',
        price: 300,
        color: StreetColor.GREEN,
        titleDeed: new StreetTitleDeed({
            baseRent: 26,
            perHouseRents: [130, 390, 900, 1100],
            hotelRent: 1275,
            mortgageValue: 150,
            housePrice: 200,
            hotelBasePrice: 200,
        }),
    }),
    communityChestSpace,
    new StreetSpace({
        name: 'Pennsylvania Avenue',
        price: 320,
        color: StreetColor.GREEN,
        titleDeed: new StreetTitleDeed({
            baseRent: 28,
            perHouseRents: [150, 450, 1000, 1200],
            hotelRent: 1400,
            mortgageValue: 160,
            housePrice: 200,
            hotelBasePrice: 200,
        }),
    }),
    new RailroadSpace({
        name: 'Short Line',
        price: 200,
    }),
    chanceSpace,
    new BirthdayGiftSpace({
        amount: 100,
    }),
    new StreetSpace({
        name: 'Florida Avenue',
        price: 350,
        color: StreetColor.BLUE,
        titleDeed: new StreetTitleDeed({
            baseRent: 35,
            perHouseRents: [175, 500, 1100, 1300],
            hotelRent: 1500,
            mortgageValue: 175,
            housePrice: 200,
            hotelBasePrice: 200,
        }),
    }),
    new StreetSpace({
        name: 'Park Place',
        price: 350,
        color: StreetColor.BLUE,
        titleDeed: new StreetTitleDeed({
            baseRent: 35,
            perHouseRents: [175, 500, 1100, 1300],
            hotelRent: 1500,
            mortgageValue: 175,
            housePrice: 200,
            hotelBasePrice: 200,
        }),
    }),
    new LuxuryTaxSpace({
        amount: 75,
    }),
    new StreetSpace({
        name: 'Boardwalk',
        price: 400,
        color: StreetColor.BLUE,
        titleDeed: new StreetTitleDeed({
            baseRent: 50,
            perHouseRents: [200, 600, 1400, 1700],
            hotelRent: 2000,
            mortgageValue: 200,
            housePrice: 200,
            hotelBasePrice: 200,
        }),
    }),
];
