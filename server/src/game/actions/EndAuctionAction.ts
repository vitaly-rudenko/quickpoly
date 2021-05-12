import { Context } from '../Context';
import { AuctionEndedLog } from '../logs/AuctionEndedLog';
import { Action } from './Action';

export class EndAuctionAction extends Action {
    constructor() {
        super({ type: 'endAuction', required: true, automatic: true });
    }

    perform(context: Context): boolean {
        if (!context.auction) return false;

        if (context.auction.highestBidder !== null) {
            context.auction.highestBidder.charge(context.auction.highestBidAmount);
            context.auction.propertySpace.setLandlord(context.auction.highestBidder);
        }

        context.endAuction();

        context.log(
            new AuctionEndedLog({
                propertySpace: context.auction.propertySpace,
                highestBidder: context.auction.highestBidder,
                highestBidAmount: context.auction.highestBidAmount,
            })
        );

        return true;
    }
}
