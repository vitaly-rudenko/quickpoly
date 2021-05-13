import type { StreetSpace } from '../map/properties/StreetSpace';
import type { Context } from '../Context';
import { Action } from './Action';
import { StreetSpaceDowngradedLog } from '../logs/StreetSpaceDowngradedLog';

interface DowngradeStreetSpaceActionData {
    streetSpace: StreetSpace;
}

export class DowngradeStreetSpaceAction extends Action {
    private _streetSpace: StreetSpace;

    constructor(streetSpace: StreetSpace) {
        super({ type: 'downgradeStreetSpace' });
        this._streetSpace = streetSpace;
    }

    perform(context: Context): boolean {
        const refund = this._streetSpace.calculateDowngradeRefund();

        this._streetSpace.downgrade();
        context.move.player.topUp(refund);

        context.log(
            new StreetSpaceDowngradedLog({
                landlord: context.move.player,
                streetSpace: this._streetSpace,
                refund,
            })
        );

        return true;
    }

    applies(data: DowngradeStreetSpaceActionData): boolean {
        return data.streetSpace === this._streetSpace;
    }
}
