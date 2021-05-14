import { mocker } from '../setup';
import { expect } from 'chai';
import { Game } from '../../src/game/Game';
import { GoSpace } from '../../src/game/map/GoSpace';
import { StreetSpace, StreetTitleDeed } from '../../src/game/map/properties/StreetSpace';
import { Player } from '../../src/game/Player';
import { RollDiceAction } from '../../src/game/actions/RollDiceAction';
import { GiveUpAction } from '../../src/game/actions/GiveUpAction';
import { MortgagePropertyAction } from '../../src/game/actions/MortgagePropertyAction';
import { PropertyMortgagedLog } from '../../src/game/logs/PropertyMortgagedLog';

describe('[mortgaging properties]', () => {
    it('should allow you to mortgage the property', () => {
        const player1 = mocker.create(Player, { money: 50 });
        const player2 = mocker.create(Player);

        const streetSpace1 = mocker.create(StreetSpace, {
            landlord: player1,
            titleDeed: mocker.create(StreetTitleDeed, { mortgageValue: 146 }),
        });

        const streetSpace2 = mocker.create(StreetSpace, {
            landlord: player1,
            titleDeed: mocker.create(StreetTitleDeed, { mortgageValue: 204 }),
        });

        const streetSpace3 = mocker.create(StreetSpace, {
            landlord: player2,
            titleDeed: mocker.create(StreetTitleDeed, { mortgageValue: 204 }),
        });

        const game = mocker.create(Game, {
            players: [player1, player2],
            map: [
                mocker.create(GoSpace),
                streetSpace1,
                mocker.create(StreetSpace),
                streetSpace2,
                streetSpace3,
                mocker.create(StreetSpace),
            ],
        });

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new MortgagePropertyAction(streetSpace1),
                new MortgagePropertyAction(streetSpace2),
                new GiveUpAction(),
            ]);

        game.performAction('mortgageProperty', { propertySpace: streetSpace2 });

        expect(streetSpace1.landlord).to.eq(player1);
        expect(streetSpace1.isMortgaged).to.be.false;
        expect(streetSpace2.landlord).to.be.null;
        expect(streetSpace2.isMortgaged).to.be.true;
        expect(player1.money).to.eq(254);

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new MortgagePropertyAction(streetSpace1),
                new GiveUpAction(),
            ]);

        game.performAction('mortgageProperty', { propertySpace: streetSpace1 });

        expect(streetSpace1.landlord).to.be.null;
        expect(streetSpace1.isMortgaged).to.be.true;
        expect(streetSpace2.landlord).to.be.null;
        expect(streetSpace2.isMortgaged).to.be.true;
        expect(player1.money).to.eq(400);

        expect(game.getAvailableActions())
            .to.deep.eq([
                new RollDiceAction(),
                new GiveUpAction(),
            ]);

        expect(game.logs)
            .to.deep.eq([
                new PropertyMortgagedLog({ landlord: player1, propertySpace: streetSpace2, mortgageValue: 204 }),
                new PropertyMortgagedLog({ landlord: player1, propertySpace: streetSpace1, mortgageValue: 146 })
            ]);
    });
});
