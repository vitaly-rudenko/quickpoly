import { expect } from 'chai';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { StreetColor, StreetSpace, StreetTitleDeed } from '../../src/game/map/properties/StreetSpace';
import { Player } from '../../src/game/Player';
import { Mocker } from '../helpers/Mocker';
import { PurchasePropertyAction } from '../../src/game/actions/PurchasePropertyAction';
import { PropertyRentPaidLog } from '../../src/game/logs/PropertyRentPaidLog';
import { DiceRolledLog } from '../../src/game/logs/DiceRolledLog';
import { PutPropertyUpForAuctionAction } from '../../src/game/actions/PutPropertyUpForAuctionAction';
import { MovedToSpaceLog } from '../../src/game/logs/MovedToSpaceLog';
import { RollDiceAction } from '../../src/game/actions/RollDiceAction';
import { PropertyPurchasedLog } from '../../src/game/logs/PropertyPurchasedLog';
import { Move } from '../../src/game/Move';

describe('[basic property actions]', () => {
    let mocker: Mocker;

    beforeEach(() => {
        mocker = new Mocker();

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
            landlord: attributes?.landlord ?? null,
            price: attributes?.price ?? 0,
            name: `Street #${index}`,
            color: StreetColor.LIGHT_BLUE,
            titleDeed: attributes?.titleDeed ?? mocker.create(StreetTitleDeed),
            houses: 0,
            hotel: false,
        }));

        mocker.register(Game, (_, attributes) => new Game({
            move: attributes?.move ?? new Move({
                player: attributes?.players?.[0] ?? mocker.create(Player)
            }),
            players: attributes?.players ?? [mocker.reuse(Player), mocker.create(Player)],
            map: attributes?.map ?? [mocker.create(GoSpace)],
        }));
    });

    it('should give player an option to purchase the property or put it up for auction', () => {
        const player1 = mocker.create(Player, { money: 100 });
        const player2 = mocker.create(Player);

        const streetSpace = mocker.create(StreetSpace, { price: 50 });

        const game = mocker.create(Game, {
            players: [player1, player2],
            map: [
                mocker.create(GoSpace),
                mocker.create(StreetSpace),
                streetSpace,
            ],
        });


        expect(game.move.logs).to.deep.eq([]);
        expect(game.move.actions).to.deep.eq([]);
        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
            ]);

        game.performAction('rollDice', { dice: [1, 1] });

        expect(game.move.player).to.eq(player1);
        expect(game.logs)
            .to.deep.eq([
                new DiceRolledLog({ player: player1, dice: [1, 1] }),
                new MovedToSpaceLog({ player: player1, space: streetSpace }),
            ]);
        expect(game.move.actions)
            .to.deep.eq([
                new RollDiceAction(),
            ]);
        expect(game.getAvailableActions())
            .to.be.deep.eq([
                new PurchasePropertyAction(streetSpace),
                new PutPropertyUpForAuctionAction(streetSpace),
            ]);
    });

    it('should not give player an option to purchase the property when they don\'t have enough money', () => {
        const player1 = mocker.create(Player, { money: 50 });
        const player2 = mocker.create(Player);

        const streetSpace = mocker.create(StreetSpace, { price: 100 });

        const game = mocker.create(Game, {
            players: [player1, player2],
            map: [
                mocker.create(GoSpace),
                mocker.create(StreetSpace),
                streetSpace,
            ],
        });

        game.performAction('rollDice', { dice: [1, 1] });

        expect(game.getAvailableActions())
            .to.be.deep.eq([
                new PutPropertyUpForAuctionAction(streetSpace),
            ]);
    });

    it('should implement property purchase and rent', () => {
        const player1 = mocker.create(Player, { money: 200 });
        const player2 = mocker.create(Player, { money: 200 });

        const streetSpace = mocker.create(StreetSpace, { price: 46, titleDeed: { baseRent: 154 } });

        const game = mocker.create(Game, {
            players: [player1, player2],
            map: [
                mocker.create(GoSpace),
                mocker.create(StreetSpace),
                streetSpace,
            ],
        });

        game.performAction('rollDice', { dice: [1, 1] });
        game.performAction('purchaseProperty');
        game.performAction('rollDice', { dice: [1, 1] });

        expect(player1.money).to.eq(200 - 46 + 154);
        expect(player2.money).to.eq(200 - 154);
        expect(streetSpace.landlord).to.eq(player1);

        expect(game.move.player).to.eq(player1);
        expect(game.logs)
            .to.deep.eq([
                new DiceRolledLog({ player: player1, dice: [1, 1] }),
                new MovedToSpaceLog({ player: player1, space: streetSpace }),
                new PropertyPurchasedLog({ player: player1, propertySpace: streetSpace }),
                new DiceRolledLog({ player: player2, dice: [1, 1] }),
                new MovedToSpaceLog({ player: player2, space: streetSpace }),
                new PropertyRentPaidLog({
                    landlord: player1,
                    tenant: player2,
                    propertySpace: streetSpace,
                    amount: 154,
                }),
            ]);
    });

    it('should implement putting property up for auction', () => {
        const player1 = mocker.create(Player, { money: 200 });
        const player2 = mocker.create(Player, { money: 200 });
        const player3 = mocker.create(Player, { money: 200 });
        const player4 = mocker.create(Player, { money: 200 });
        const player5 = mocker.create(Player, { money: 200 });

        const streetSpace = mocker.create(StreetSpace, { price: 46, titleDeed: { baseRent: 154 } });

        const game = mocker.create(Game, {
            move: new Move({ player: player2 }),
            players: [player1, player2, player3, player4, player5],
            map: [
                mocker.create(GoSpace),
                mocker.create(StreetSpace),
                streetSpace,
            ],
        });

        game.performAction('rollDice', { dice: [1, 1] }); // player 2
        game.performAction('putPropertyUpForAuction'); // player 2
        game.performAction('pass'); // player 3
        game.performAction('bid', { amount: 160 }); // player 4
        game.performAction('bid', { amount: 165 }); // player 5
        game.performAction('pass'); // player 1
        game.performAction('bid', { amount: 170 }); // player 4
        game.performAction('bid', { amount: 175 }); // player 5
        game.performAction('bid', { amount: 180 }); // player 4
        game.performAction('pass'); // player 5

        expect(streetSpace.landlord).to.eq(player4);
        expect(player4.money).to.eq(20);
        expect(player2.money).to.eq(200);

        expect(game.move.player).to.eq(player3);

        expect(game.move.actions).to.deep.eq([]);
        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
            ]);

        // expect(game.move.player).to.eq(player1);
        // expect(game.logs)
        //     .to.deep.eq([
        //         new DiceRolledLog({ player: player1, dice: [1, 1] }),
        //         new MovedToSpaceLog({ player: player1, space: streetSpace }),
        //         new PropertyPurchasedLog({ player: player1, propertySpace: streetSpace }),
        //         new DiceRolledLog({ player: player2, dice: [1, 1] }),
        //         new MovedToSpaceLog({ player: player2, space: streetSpace }),
        //         new PropertyRentPaidLog({
        //             landlord: player1,
        //             tenant: player2,
        //             propertySpace: streetSpace,
        //             amount: 154,
        //         }),
        //     ]);
    });
});
