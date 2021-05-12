import { PropertySpace } from '../map/properties/PropertySpace';
import { Player } from '../Player';
import { Log } from './Log';

export class AuctionEndedLog extends Log {
    private _highestBidder: Player | null;
    private _propertySpace: PropertySpace;
    private _amount: number;

    constructor(attributes: {
        highestBidder: Player | null,
        propertySpace: PropertySpace,
        highestBidAmount: number
    }) {
        super({ type: 'auctionEnded' });

        this._highestBidder = attributes.highestBidder;
        this._propertySpace = attributes.propertySpace;
        this._amount = attributes.highestBidAmount;
    }
}
