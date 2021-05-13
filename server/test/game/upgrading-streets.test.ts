import { mocker } from '../setup';
import { Player } from '../../src/game/Player';
import { StreetColor, StreetSpace } from '../../src/game/map/properties/StreetSpace';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { expect } from 'chai';
import { RollDiceAction } from '../../src/game/actions/RollDiceAction';
import { UpgradeStreetSpaceAction } from '../../src/game/actions/UpgradeStreetSpaceAction';

describe('[upgrading streets]', () => {
    let player1: Player;
    let player2: Player;
    let orangeStreet1: StreetSpace;
    let orangeStreet2: StreetSpace;
    let orangeStreet3: StreetSpace;
    let game: Game;

    beforeEach(() => {
        player1 = mocker.create(Player, { money: 1500 });
        player2 = mocker.create(Player, { money: 1500 });

        orangeStreet1 = mocker.create(StreetSpace, {
            color: StreetColor.ORANGE,
            landlord: player1,
            titleDeed: {
                housePrice: 16,
                hotelBasePrice: 35
            }
        });

        orangeStreet2 = mocker.create(StreetSpace, {
            color: StreetColor.ORANGE,
            landlord: player1,
            titleDeed: {
                housePrice: 18,
                hotelBasePrice: 48
            }
        });

        orangeStreet3 = mocker.create(StreetSpace, {
            color: StreetColor.ORANGE,
            landlord: player1,
            titleDeed: {
                housePrice: 22,
                hotelBasePrice: 62
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

    function upgrade(streetSpace: StreetSpace): void {
        game.performAction('upgradeStreetSpace', { streetSpace });
    }

    it('should allow players to upgrade streets when they have monopoly', () => {
        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction({ streetSpace: orangeStreet1 }),
                new UpgradeStreetSpaceAction({ streetSpace: orangeStreet2 }),
                new UpgradeStreetSpaceAction({ streetSpace: orangeStreet3 }),
            ]);
    });

    it('should implement street upgrading', () => {
        repeat(() => upgrade(orangeStreet2)).times(2);

        expect(orangeStreet1.houses).to.eq(0);
        expect(orangeStreet1.hotel).to.be.false;

        expect(orangeStreet2.houses).to.eq(2);
        expect(orangeStreet2.hotel).to.be.false;

        expect(orangeStreet3.houses).to.eq(0);
        expect(orangeStreet3.hotel).to.be.false;

        repeat(() => upgrade(orangeStreet2)).times(3);

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction({ streetSpace: orangeStreet1 }),
                new UpgradeStreetSpaceAction({ streetSpace: orangeStreet3 }),
            ]);

        expect(orangeStreet1.houses).to.eq(0);
        expect(orangeStreet1.hotel).to.be.false;

        expect(orangeStreet2.houses).to.eq(0);
        expect(orangeStreet2.hotel).to.be.true;

        expect(orangeStreet3.houses).to.eq(0);
        expect(orangeStreet3.hotel).to.be.false;

        repeat(() => {
            upgrade(orangeStreet1);
            upgrade(orangeStreet3);
        }).times(2);

        expect(orangeStreet1.houses).to.eq(2);
        expect(orangeStreet1.hotel).to.be.false;

        expect(orangeStreet2.houses).to.eq(0);
        expect(orangeStreet2.hotel).to.be.true;

        expect(orangeStreet3.houses).to.eq(2);
        expect(orangeStreet3.hotel).to.be.false;

        repeat(() => {
            upgrade(orangeStreet1);
            upgrade(orangeStreet3);
        }).times(3);

        expect(orangeStreet1.houses).to.eq(0);
        expect(orangeStreet1.hotel).to.be.true;

        expect(orangeStreet2.houses).to.eq(0);
        expect(orangeStreet2.hotel).to.be.true;

        expect(orangeStreet3.houses).to.eq(0);
        expect(orangeStreet3.hotel).to.be.true;

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
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
