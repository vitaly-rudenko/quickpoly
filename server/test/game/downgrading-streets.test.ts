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
import { StreetSpaceDowngradedLog } from '../../src/game/logs/StreetSpaceDowngradedLog';

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
                hotelPrice: 36
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
            houses: 1,
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
                new DowngradeStreetSpaceAction(orangeStreet3),
                new GiveUpAction(),
            ]);
    });

    it('should implement street downgrading', () => {
        expect(player1.money).to.eq(0);

        downgrade(orangeStreet2);

        expect(player1.money).to.eq(18 / 2);

        expect(orangeStreet1.houses).to.eq(0);
        expect(orangeStreet1.hotel).to.be.true;

        expect(orangeStreet2.houses).to.eq(2);
        expect(orangeStreet2.hotel).to.be.false;

        expect(orangeStreet3.houses).to.eq(1);
        expect(orangeStreet3.hotel).to.be.false;

        downgrade(orangeStreet1);

        expect(player1.money).to.eq(18 / 2 + 36 / 2);

        expect(orangeStreet1.houses).to.eq(4);
        expect(orangeStreet1.hotel).to.be.false;

        expect(orangeStreet2.houses).to.eq(2);
        expect(orangeStreet2.hotel).to.be.false;

        expect(orangeStreet3.houses).to.eq(1);
        expect(orangeStreet3.hotel).to.be.false;

        downgrade(orangeStreet3);

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction(orangeStreet1),
                new DowngradeStreetSpaceAction(orangeStreet1),
                new UpgradeStreetSpaceAction(orangeStreet2),
                new DowngradeStreetSpaceAction(orangeStreet2),
                new UpgradeStreetSpaceAction(orangeStreet3),
                new MortgagePropertyAction(orangeStreet3),
                new GiveUpAction(),
            ]);

        expect(player1.money).to.eq(18 / 2 + 36 / 2 + 22 / 2);

        expect(orangeStreet1.houses).to.eq(4);
        expect(orangeStreet1.hotel).to.be.false;

        expect(orangeStreet2.houses).to.eq(2);
        expect(orangeStreet2.hotel).to.be.false;

        expect(orangeStreet3.houses).to.eq(0);
        expect(orangeStreet3.hotel).to.be.false;

        repeat(() => downgrade(orangeStreet1)).times(4);
        repeat(() => downgrade(orangeStreet2)).times(2);

        expect(player1.money).to.eq((16 / 2) * 4 + (18 / 2) * 3 + 36 / 2 + 22 / 2);

        expect(orangeStreet1.houses).to.eq(0);
        expect(orangeStreet1.hotel).to.be.false;

        expect(orangeStreet2.houses).to.eq(0);
        expect(orangeStreet2.hotel).to.be.false;

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet1),
                new UpgradeStreetSpaceAction(orangeStreet2),
                new MortgagePropertyAction(orangeStreet2),
                new UpgradeStreetSpaceAction(orangeStreet3),
                new MortgagePropertyAction(orangeStreet3),
                new GiveUpAction(),
            ]);

        expect(game.logs)
            .to.deep.eq([
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet2, refund: 18 / 2 }),
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet1, refund: 36 / 2 }),
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet3, refund: 22 / 2 }),
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet1, refund: 16 / 2 }),
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet1, refund: 16 / 2 }),
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet1, refund: 16 / 2 }),
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet1, refund: 16 / 2 }),
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet2, refund: 18 / 2 }),
                new StreetSpaceDowngradedLog({ landlord: player1, streetSpace: orangeStreet2, refund: 18 / 2 }),
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
