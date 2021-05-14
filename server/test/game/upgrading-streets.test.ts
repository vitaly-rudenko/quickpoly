import { mocker } from '../setup';
import { Player } from '../../src/game/Player';
import { StreetColor, StreetSpace } from '../../src/game/map/properties/StreetSpace';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { expect } from 'chai';
import { RollDiceAction } from '../../src/game/actions/RollDiceAction';
import { UpgradeStreetSpaceAction } from '../../src/game/actions/UpgradeStreetSpaceAction';
import { StreetSpaceUpgradedLog } from '../../src/game/logs/StreetSpaceUpgradedLog';
import { GiveUpAction } from '../../src/game/actions/GiveUpAction';
import { MortgagePropertyAction } from '../../src/game/actions/MortgagePropertyAction';

describe('[upgrading streets]', () => {
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
            titleDeed: {
                housePrice: 16,
                hotelPrice: 35
            }
        });

        orangeStreet2 = mocker.create(StreetSpace, {
            color: StreetColor.ORANGE,
            landlord: player1,
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

    function upgrade(streetSpace: StreetSpace): void {
        game.performAction('upgradeStreetSpace', { streetSpace });
    }

    it('should allow players to upgrade streets when they have monopoly', () => {
        player1.topUp(1000);

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
    });

    it('should implement street upgrading', () => {
        player1.topUp(1000);

        repeat(() => upgrade(orangeStreet2)).times(2);

        expect(orangeStreet1.houses).to.eq(0);
        expect(orangeStreet1.hotel).to.be.false;

        expect(orangeStreet2.houses).to.eq(2);
        expect(orangeStreet2.hotel).to.be.false;

        expect(orangeStreet3.houses).to.eq(0);
        expect(orangeStreet3.hotel).to.be.false;

        repeat(() => upgrade(orangeStreet2)).times(3);

        expect(orangeStreet1.houses).to.eq(0);
        expect(orangeStreet1.hotel).to.be.false;

        expect(orangeStreet2.houses).to.eq(0);
        expect(orangeStreet2.hotel).to.be.true;

        expect(orangeStreet3.houses).to.eq(0);
        expect(orangeStreet3.hotel).to.be.false;

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet1),
                new UpgradeStreetSpaceAction(orangeStreet3),
                new MortgagePropertyAction(orangeStreet3),
                new GiveUpAction(),
            ]);

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
                new GiveUpAction(),
            ]);

        expect(game.logs)
            .to.deep.eq([
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet2, price: 18 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet2, price: 18 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet2, price: 18 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet2, price: 18 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet2, price: 48 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet1, price: 16 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet3, price: 22 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet1, price: 16 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet3, price: 22 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet1, price: 16 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet3, price: 22 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet1, price: 16 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet3, price: 22 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet1, price: 35 }),
                new StreetSpaceUpgradedLog({ landlord: player1, streetSpace: orangeStreet3, price: 62 })
            ]);
    });

    it('should charge properly for street upgrading', () => {
        player1.topUp(1000);

        expect(player1.money).to.eq(1000);

        upgrade(orangeStreet2);

        expect(player1.money).to.eq(1000 - 18);

        repeat(() => upgrade(orangeStreet2)).times(3);

        expect(player1.money).to.eq(1000 - 18 * 4);

        upgrade(orangeStreet2);

        expect(player1.money).to.eq(1000 - 18 * 4 - 48);

        repeat(() => upgrade(orangeStreet1)).times(5);

        expect(player1.money).to.eq(1000 - 18 * 4 - 48 - 16 * 4 - 35);

        repeat(() => upgrade(orangeStreet3)).times(5);

        expect(player1.money).to.eq(1000 - 18 * 4 - 48 - 16 * 4 - 35 - 22 * 4 - 62);
    });

    it('should not allow upgrade when not enough money', () => {
        player1.topUp(15); // 15

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new MortgagePropertyAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet2),
                new MortgagePropertyAction(orangeStreet3),
                new GiveUpAction(),
            ]);

        player1.topUp(2); // 17

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet2),
                new MortgagePropertyAction(orangeStreet3),
                new GiveUpAction(),
            ]);

        player1.topUp(4); // 21

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet1),
                new UpgradeStreetSpaceAction(orangeStreet2),
                new MortgagePropertyAction(orangeStreet2),
                new MortgagePropertyAction(orangeStreet3),
                new GiveUpAction(),
            ]);

        player1.topUp(1); // 22

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

        upgrade(orangeStreet3);

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new MortgagePropertyAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet2),
                new GiveUpAction(),
            ]);

        player1.topUp(18 * 4);

        repeat(() => upgrade(orangeStreet2)).times(4);

        player1.topUp(47);

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet1),
                new UpgradeStreetSpaceAction(orangeStreet3),
                new GiveUpAction(),
            ]);

        player1.topUp(1);

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new UpgradeStreetSpaceAction(orangeStreet1),
                new MortgagePropertyAction(orangeStreet1),
                new UpgradeStreetSpaceAction(orangeStreet2),
                new UpgradeStreetSpaceAction(orangeStreet3),
                new GiveUpAction(),
            ]);

        upgrade(orangeStreet2);

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new MortgagePropertyAction(orangeStreet1),
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
