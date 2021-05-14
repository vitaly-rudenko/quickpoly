import { mocker } from '../setup';
import { expect } from 'chai';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { StreetSpace } from '../../src/game/map/properties/StreetSpace';
import { Player } from '../../src/game/Player';
import { PurchasePropertyAction } from '../../src/game/actions/PurchasePropertyAction';
import { PropertyRentPaidLog } from '../../src/game/logs/PropertyRentPaidLog';
import { DiceRolledLog } from '../../src/game/logs/DiceRolledLog';
import { PutPropertyUpForAuctionAction } from '../../src/game/actions/PutPropertyUpForAuctionAction';
import { MovedToSpaceLog } from '../../src/game/logs/MovedToSpaceLog';
import { RollDiceAction } from '../../src/game/actions/RollDiceAction';
import { PropertyPurchasedLog } from '../../src/game/logs/PropertyPurchasedLog';
import { GiveUpAction } from '../../src/game/actions/GiveUpAction';

describe('[purchasing properties]', () => {
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
                new GiveUpAction(),
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
                new GiveUpAction(),
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
                new GiveUpAction(),
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
        game.performAction('endMove');
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
});
