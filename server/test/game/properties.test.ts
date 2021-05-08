import { expect } from 'chai';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { StreetColor, StreetSpace, StreetTitleDeed } from '../../src/game/map/properties/StreetSpace';
import { Player } from '../../src/game/Player';
import { Mocker } from '../helpers/Mocker';
import { GiveUpAction } from '../../src/game/actions/GiveUpAction';
import { PutPropertyUpForAuction } from '../../src/game/actions/PutPropertyUpForAuction';
import { PurchasePropertyAction } from '../../src/game/actions/PurchasePropertyAction';
import { PropertyPurchasedLog } from '../../src/game/logs/PropertyPurchasedLog';

describe('[properties]', () => {
    let mocker: Mocker;

    beforeEach(() => {
        mocker = new Mocker();

        mocker.register(Game, (_, attributes) => new Game({
            move: {
                player: attributes?.players?.[0] ?? mocker.create(Player),
            },
            players: attributes?.players ?? [mocker.reuse(Player)],
            map: attributes?.map ?? [],
        }));

        mocker.register(Player, ({ index }, attributes) => new Player({
            id: attributes?.id ?? `player-${index + 1}`,
            position: attributes?.position ?? 0,
            money: attributes?.money ?? 0,
        }));

        mocker.register(GoSpace, () => new GoSpace({ salary: 0 }));
        mocker.register(StreetSpace, (_, attributes) => new StreetSpace({
            name: 'My street',
            color: StreetColor.LIGHT_BLUE,
            price: attributes?.price ?? 0,
            titleDeed: new StreetTitleDeed({
                baseRent: 0,
                hotelBasePrice: 0,
                hotelRent: 0,
                housePrice: 0,
                mortgageValue: 0,
                perHouseRents: [0],
            }),
        }));
    });

    it('should add purchase and auction actions for player', () => {
        const player = mocker.create(Player);
        const street = mocker.create(StreetSpace);

        const game = mocker.create(Game, {
            players: [player],
            map: [street],
        });

        expect(game.getAvailableActions())
            .to.be.deep.eq([
                new PurchasePropertyAction(street),
                new PutPropertyUpForAuction(street),
                new GiveUpAction(),
            ]);
    });

    it('should allow player to buy the property', () => {
        const playerId = 'fake-player-id';

        const player = mocker.create(Player, { id: playerId, money: 100 });
        const streetSpace = mocker.create(StreetSpace, { price: 46 });

        const game = mocker.create(Game, {
            players: [player],
            map: [streetSpace],
        });

        expect(player.money).to.eq(100);
        expect(streetSpace.ownerId).to.be.null;
        expect(game.getLogs()).to.be.deep.eq([]);

        game.performAction(PurchasePropertyAction);

        expect(player.money).to.eq(54);
        expect(streetSpace.ownerId).to.eq(0);
        expect(game.getLogs())
            .to.be.deep.eq([
                new PropertyPurchasedLog({ player, propertySpace: streetSpace }),
            ]);
    });
});
