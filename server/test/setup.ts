import { Game } from '../src/game/Game';
import { GoSpace } from '../src/game/map/GoSpace';
import { StreetColor, StreetSpace, StreetTitleDeed } from '../src/game/map/properties/StreetSpace';
import { Player } from '../src/game/Player';
import { Move } from '../src/game/Move';
import { Mocker } from './helpers/Mocker';

export const mocker = new Mocker();

mocker.register(Player, ({ index }, attributes) => new Player({
    id: attributes?.id ?? `player-${index + 1}`,
    position: attributes?.position ?? 0,
    money: attributes?.money ?? 100,
}));

mocker.register(GoSpace, () => new GoSpace({ salary: 0 }));

mocker.register(StreetTitleDeed, (_, attributes) => new StreetTitleDeed({
    baseRent: attributes?.baseRent ?? 50,
    hotelPrice: attributes?.hotelPrice ?? 100,
    hotelRent: attributes?.hotelRent ?? 150,
    housePrice: attributes?.housePrice ?? 200,
    mortgageValue: attributes?.mortgageValue ?? 250,
    perHouseRents: attributes?.perHouseRents ?? [25, 75, 125, 175],
}));

mocker.register(StreetSpace, ({ index }, attributes) => new StreetSpace({
    landlord: attributes?.landlord ?? null,
    price: attributes?.price ?? 50,
    name: `Street #${index}`,
    color: StreetColor.LIGHT_BLUE,
    titleDeed: attributes?.titleDeed ?? mocker.create(StreetTitleDeed),
    houses: attributes?.houses ?? 0,
    hotel: attributes?.hotel ?? false,
}));

mocker.register(Game, (_, attributes) => new Game({
    move: attributes?.move ?? mocker.create(Move, {
        player: attributes?.players?.[0] ?? mocker.create(Player)
    }),
    players: attributes?.players ?? [mocker.reuse(Player), mocker.create(Player)],
    map: attributes?.map ?? [mocker.create(GoSpace)],
}));

export const mochaHooks = {
    beforeEach() {
        mocker.reset();
    }
};
