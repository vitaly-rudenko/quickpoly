import { mocker } from '../setup';
import { Player } from '../../src/game/Player';
import { StreetColor, StreetSpace } from '../../src/game/map/properties/StreetSpace';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { expect } from 'chai';
import { RollDiceAction } from '../../src/game/actions/RollDiceAction';
import { UpgradeStreetSpaceAction } from '../../src/game/actions/UpgradeStreetSpaceAction';
import { GiveUpAction } from '../../src/game/actions/GiveUpAction';
import { MortgagePropertyAction } from '../../src/game/actions/MortgagePropertyAction';
import { DowngradeStreetSpaceAction } from '../../src/game/actions/DowngradeStreetSpaceAction';

describe('[downgrading streets]', () => {
    let player1: Player;
    let player2: Player;
    let orangeStreet1: StreetSpace;
    let orangeStreet2: StreetSpace;
    let orangeStreet3: StreetSpace;
    let game: Game;

    beforeEach(() => {
        player1 = mocker.create(Player, { money: 0 });
        player2 = mocker.create(Player, { money: 0 });

        orangeStreet1 = mocker.create(StreetSpace, {
            color: StreetColor.ORANGE,
            landlord: player1,
            hotel: true,
            titleDeed: {
                housePrice: 16,
                hotelPrice: 35
            }
        });

        orangeStreet2 = mocker.create(StreetSpace, {
            color: StreetColor.ORANGE,
            landlord: player1,
            houses: 3,
            titleDeed: {
                housePrice: 18,
                hotelPrice: 48
            }
        });

        orangeStreet3 = mocker.create(StreetSpace, {
            color: StreetColor.ORANGE,
            landlord: player1,
            titleDeed: {
                housePrice: 22,
                hotelPrice: 62
            }
        });

        game = mocker.create(Game, {
            players: [player1, player2],
            map: [
                mocker.create(GoSpace),
                orangeStreet1,
                orangeStreet2,
                orangeStreet3
            ]
        });
    });

    function downgrade(streetSpace: StreetSpace): void {
        game.performAction('downgradeStreetSpace', { streetSpace });
    }

    it('should allow players to downgrade streets', () => {
        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new DowngradeStreetSpaceAction(orangeStreet1),
                new DowngradeStreetSpaceAction(orangeStreet2),
                new MortgagePropertyAction(orangeStreet3),
                new GiveUpAction(),
            ]);
    });
});

function repeat(callback: Function) {
    return {
        times(times: number): void {
            for (let i = 0; i < times; i++) {
                callback();
            }
        }
    };
}
