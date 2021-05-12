import { Context } from '../Context';
import { BidLog } from '../logs/BidLog';
import { Move } from '../Move';
import { Action } from './Action';

export class BidAction extends Action {
    constructor() {
        super({ type: 'bid', required: true });
    }

    perform(context: Context, data: { amount: number }): boolean {
        if (!context.auction) return false;

        context.auction.bid(context.move.player, data.amount);

        context.log(
            new BidLog({
                player: context.move.player,
                amount: data.amount
            })
        );

        return true;
    }
}
