import type { PropertySpace } from '../map/properties/PropertySpace';
import { Context } from '../Context';
import { Action } from './Action';
import { PropertyPutUpForAuctionLog } from '../logs/PropertyPutUpForAuctionLog';
import { Auction } from '../Auction';

export class PutPropertyUpForAuctionAction extends Action {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: 'putPropertyUpForAuction', required: true });
        this._propertySpace = propertySpace;
    }

    perform(context: Context): boolean {
        context.startAuction(
            new Auction({
                initialMove: context.move,
                players: context.players,
                propertySpace: this._propertySpace,
            })
        );

        context.log(
            new PropertyPutUpForAuctionLog({
                propertySpace: this._propertySpace,
            })
        );

        return true;
    }
}
