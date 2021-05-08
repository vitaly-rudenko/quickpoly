import { expect } from 'chai';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { StreetColor, StreetSpace, StreetTitleDeed } from '../../src/game/map/properties/StreetSpace';
import { Player } from '../../src/game/Player';
import { Mocker } from '../helpers/Mocker';
import { PurchasePropertyAction } from '../../src/game/actions/PurchasePropertyAction';
import { PropertyPurchasedLog } from '../../src/game/logs/PropertyPurchasedLog';
import { PropertyRentPaidLog } from '../../src/game/logs/PropertyRentPaidLog';
import { PayPropertyRentAction } from '../../src/game/actions/PayPropertyRentAction';

describe('[properties]', () => {
    let mocker: Mocker;

    beforeEach(() => {
        mocker = new Mocker();

        mocker.register(Game, (_, attributes) => new Game({
            move: {
                player: attributes?.move?.player
                    ?? attributes?.players?.[0]
                    ?? mocker.create(Player),
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

        mocker.register(StreetTitleDeed, (_, attributes) => new StreetTitleDeed({
            baseRent: attributes?.baseRent ?? 0,
            hotelBasePrice: 0,
            hotelRent: 0,
            housePrice: 0,
            mortgageValue: 0,
            perHouseRents: [0],
        }));

        mocker.register(StreetSpace, ({ index }, attributes) => new StreetSpace({
            owner: attributes?.owner ?? null,
            price: attributes?.price ?? 0,
            name: `Street #${index}`,
            color: StreetColor.LIGHT_BLUE,
            titleDeed: attributes?.titleDeed ?? mocker.create(StreetTitleDeed),
        }));
    });

    it('should give player an option to purchase the property', () => {
        const player = mocker.create(Player);
        const streetSpace = mocker.create(StreetSpace);

        const game = mocker.create(Game, {
            players: [player],
            map: [streetSpace],
        });

        expect(game.getAvailableActions())
            .to.be.deep.eq([
                new PurchasePropertyAction(streetSpace),
            ]);
    });

    it('should allow player to purchase the property', () => {
        const player = mocker.create(Player, { money: 100 });
        const streetSpace = mocker.create(StreetSpace, { price: 46 });

        const game = mocker.create(Game, {
            players: [player],
            map: [streetSpace],
        });

        expect(player.money).to.eq(100);
        expect(streetSpace.owner).to.be.null;
        expect(game.getLogs()).to.be.deep.eq([]);

        game.start();
        game.performAction('purchaseProperty');

        expect(player.money).to.eq(54);
        expect(streetSpace.owner).to.eq(player);
        expect(game.getLogs())
            .to.be.deep.eq([
                new PropertyPurchasedLog({ player, propertySpace: streetSpace }),
            ]);
    });

    it.only('should charge player for the rent', () => {
        const player1 = mocker.create(Player);
        const player2 = mocker.create(Player, { money: 200 });

        const streetSpace = mocker.create(StreetSpace, {
            owner: player1,
            titleDeed: mocker.create(StreetTitleDeed, { baseRent: 154 }),
        });

        const game = mocker.create(Game, {
            move: { player: player2 },
            players: [player1, player2],
            map: [streetSpace],
        });

        expect(player2.money).to.eq(200);
        expect(game.getLogs()).to.be.deep.eq([]);
        expect(game.getAvailableActions())
            .to.be.deep.eq([
                new PayPropertyRentAction(streetSpace),
            ]);

        game.start();

        expect(player2.money).to.eq(46);
        expect(game.getLogs()).to.be.deep.eq([
            new PropertyRentPaidLog({
                player: player2,
                propertySpace: streetSpace,
                amount: 154,
            }),
        ]);
        expect(game.getAvailableActions())
            .to.be.deep.eq([]);
    });
});
