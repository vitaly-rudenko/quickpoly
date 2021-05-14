import { mocker } from '../setup';
import { expect } from 'chai';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { StreetSpace } from '../../src/game/map/properties/StreetSpace';
import { Player } from '../../src/game/Player';
import { PropertyRentPaidLog } from '../../src/game/logs/PropertyRentPaidLog';
import { DiceRolledLog } from '../../src/game/logs/DiceRolledLog';
import { MovedToSpaceLog } from '../../src/game/logs/MovedToSpaceLog';
import { PropertyPurchasedLog } from '../../src/game/logs/PropertyPurchasedLog';
import { MoveEndedLog } from '../../src/game/logs/MoveEndedLog';
import { Move } from '../../src/game/Move';

describe('[paying street rent]', () => {
    it('should implement street rent paying (base rent)', () => {
        const player1 = mocker.create(Player, { money: 200 });
        const player2 = mocker.create(Player, { money: 200 });

        const streetSpace = mocker.create(StreetSpace, {
            landlord: player2,
            titleDeed: { baseRent: 154 }
        });

        const game = mocker.create(Game, {
            players: [player1, player2],
            map: [
                mocker.create(GoSpace),
                mocker.create(StreetSpace),
                streetSpace,
            ],
        });

        game.performAction('rollDice', { dice: [1, 1] });

        expect(player1.money).to.eq(200 - 154);
        expect(player2.money).to.eq(200 + 154);

        expect(game.move.player).to.eq(player2);
        expect(game.logs)
            .to.deep.eq([
                new DiceRolledLog({ player: player1, dice: [1, 1] }),
                new MovedToSpaceLog({ player: player1, space: streetSpace }),
                new PropertyRentPaidLog({
                    landlord: player2,
                    tenant: player1,
                    propertySpace: streetSpace,
                    amount: 154,
                }),
            ]);
    });
});
