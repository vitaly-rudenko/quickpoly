import { mocker } from '../setup';
import { expect } from 'chai';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { StreetSpace } from '../../src/game/map/properties/StreetSpace';
import { Player } from '../../src/game/Player';
import { DiceRolledLog } from '../../src/game/logs/DiceRolledLog';
import { MovedToSpaceLog } from '../../src/game/logs/MovedToSpaceLog';
import { RollDiceAction } from '../../src/game/actions/RollDiceAction';
import { Move } from '../../src/game/Move';
import { AuctionEndedLog } from '../../src/game/logs/AuctionEndedLog';
import { PassedLog } from '../../src/game/logs/PassedLog';
import { BidLog } from '../../src/game/logs/BidLog';
import { PropertyPutUpForAuctionLog } from '../../src/game/logs/PropertyPutUpForAuctionLog';
import { GiveUpAction } from '../../src/game/actions/GiveUpAction';

describe('[auctioning properties]', () => {
    it('should implement putting property up for auction', () => {
        const player1 = mocker.create(Player, { money: 200 });
        const player2 = mocker.create(Player, { money: 200 });
        const player3 = mocker.create(Player, { money: 200 });
        const player4 = mocker.create(Player, { money: 200 });
        const player5 = mocker.create(Player, { money: 200 });

        const streetSpace = mocker.create(StreetSpace);

        const game = mocker.create(Game, {
            move: mocker.create(Move, { player: player2 }),
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
        game.performAction('bid', { amount: 11 }); // player 4
        game.performAction('bid', { amount: 40 }); // player 5
        game.performAction('pass'); // player 1
        game.performAction('bid', { amount: 50 }); // player 2
        game.performAction('bid', { amount: 60 }); // player 4
        game.performAction('bid', { amount: 120 }); // player 5
        game.performAction('pass'); // player 2
        game.performAction('bid', { amount: 180 }); // player 4
        game.performAction('pass'); // player 5

        expect(streetSpace.landlord).to.eq(player4);
        expect(player4.money).to.eq(20);
        expect([player1, player2, player3, player5].every(p => p.money === 200))
            .to.be.true; // should not charge

        expect(game.move.player).to.eq(player3);
        expect(game.move.actions).to.deep.eq([]);
        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new GiveUpAction(),
            ]);
    });

    it('should skip players who don\'t have enough money to bid higher than the current bid', () => {
        const player1 = mocker.create(Player, { money: 100 });
        const player2 = mocker.create(Player, { money: 200 });
        const player3 = mocker.create(Player, { money: 300 });
        const player4 = mocker.create(Player, { money: 400 });
        const player5 = mocker.create(Player, { money: 500 });

        const streetSpace = mocker.create(StreetSpace);

        const game = mocker.create(Game, {
            players: [player1, player2, player3, player4, player5],
            map: [
                mocker.create(GoSpace),
                mocker.create(StreetSpace),
                streetSpace,
            ],
        });

        game.performAction('rollDice', { dice: [1, 1] }); // player 1
        game.performAction('putPropertyUpForAuction'); // player 1
        game.performAction('bid', { amount: 50 }); // player 2
        game.performAction('bid', { amount: 55 }); // player 3
        game.performAction('bid', { amount: 60 }); // player 4
        game.performAction('bid', { amount: 65 }); // player 5
        game.performAction('bid', { amount: 70 }); // player 1
        game.performAction('bid', { amount: 80 }); // player 2
        game.performAction('bid', { amount: 85 }); // player 3
        game.performAction('bid', { amount: 90 }); // player 4
        game.performAction('bid', { amount: 100 }); // player 5
        // skipped player 1
        game.performAction('bid', { amount: 125 }); // player 2
        game.performAction('bid', { amount: 150 }); // player 3
        game.performAction('bid', { amount: 175 }); // player 4
        game.performAction('bid', { amount: 200 }); // player 5
        // skipped player 2
        game.performAction('bid', { amount: 233 }); // player 3
        game.performAction('bid', { amount: 266 }); // player 4
        game.performAction('bid', { amount: 300 }); // player 5
        // skipped player 3
        game.performAction('bid', { amount: 350 }); // player 4
        game.performAction('bid', { amount: 400 }); // player 5
        // skipped player 4

        expect(streetSpace.landlord).to.eq(player5);
        expect(player5.money).to.eq(100);

        expect(game.logs)
            .to.deep.eq([
                new DiceRolledLog({ player: player1, dice: [1, 1] }),
                new MovedToSpaceLog({ player: player1, space: streetSpace }),
                new PropertyPutUpForAuctionLog({ propertySpace: streetSpace }),
                new BidLog({ player: player2, amount: 50 }),
                new BidLog({ player: player3, amount: 55 }),
                new BidLog({ player: player4, amount: 60 }),
                new BidLog({ player: player5, amount: 65 }),
                new BidLog({ player: player1, amount: 70 }),
                new BidLog({ player: player2, amount: 80 }),
                new BidLog({ player: player3, amount: 85 }),
                new BidLog({ player: player4, amount: 90 }),
                new BidLog({ player: player5, amount: 100 }),
                new PassedLog({ player: player1 }),
                new BidLog({ player: player2, amount: 125 }),
                new BidLog({ player: player3, amount: 150 }),
                new BidLog({ player: player4, amount: 175 }),
                new BidLog({ player: player5, amount: 200 }),
                new PassedLog({ player: player2 }),
                new BidLog({ player: player3, amount: 233 }),
                new BidLog({ player: player4, amount: 266 }),
                new BidLog({ player: player5, amount: 300 }),
                new PassedLog({ player: player3 }),
                new BidLog({ player: player4, amount: 350 }),
                new BidLog({ player: player5, amount: 400 }),
                new PassedLog({ player: player4 }),
                new AuctionEndedLog({
                    highestBidder: player5,
                    propertySpace: streetSpace,
                    highestBidAmount: 400
                })
            ]);
    });

    it('should end the auction prematurely when nobody has enough money to bid', () => {
        const player1 = mocker.create(Player, { money: 10 });
        const player2 = mocker.create(Player, { money: 0 });
        const player3 = mocker.create(Player, { money: 3 });
        const player4 = mocker.create(Player, { money: 5 });
        const player5 = mocker.create(Player, { money: 9 });

        const streetSpace = mocker.create(StreetSpace);

        const game = mocker.create(Game, {
            players: [player1, player2, player3, player4, player5],
            map: [
                mocker.create(GoSpace),
                mocker.create(StreetSpace),
                streetSpace,
            ],
        });

        game.performAction('rollDice', { dice: [1, 1] }); // player 1
        game.performAction('putPropertyUpForAuction'); // player 1

        expect(streetSpace.landlord).to.be.null;
        expect(game.move.player).to.eq(player2);
        expect(game.move.actions).to.deep.eq([]);
        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new GiveUpAction(),
            ]);

        expect(game.logs)
            .to.deep.eq([
                new DiceRolledLog({ player: player1, dice: [1, 1] }),
                new MovedToSpaceLog({ player: player1, space: streetSpace }),
                new PropertyPutUpForAuctionLog({ propertySpace: streetSpace }),
                new PassedLog({ player: player2 }),
                new PassedLog({ player: player3 }),
                new PassedLog({ player: player4 }),
                new PassedLog({ player: player5 }),
                new PassedLog({ player: player1 }),
                new AuctionEndedLog({
                    highestBidder: null,
                    propertySpace: streetSpace,
                    highestBidAmount: 10,
                })
            ]);
    });
});
