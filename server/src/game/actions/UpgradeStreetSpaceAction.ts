import type { Context } from '../Context';
import { Action } from './Action';
import { StreetSpace } from '../map/properties/StreetSpace';
import { PropertyUpgradedLog } from '../logs/PropertyUpgradedLog';

export class UpgradeStreetSpaceAction extends Action {
    private _streetSpace: StreetSpace;

    constructor(attributes: { streetSpace: StreetSpace }) {
        super({ type: 'upgradeStreetSpace' });

        this._streetSpace = attributes.streetSpace;
    }

    perform(context: Context): boolean {
        const price = this._streetSpace.calculateUpgradePrice();

        context.move.player.charge(price);
        this._streetSpace.upgrade();

        context.log(
            new PropertyUpgradedLog({
                player: context.move.player,
                streetSpace: this._streetSpace,
                price,
            })
        );

        return true;
    }

    applies(data?: any): boolean {
        return data.streetSpace === this._streetSpace;
    }
}