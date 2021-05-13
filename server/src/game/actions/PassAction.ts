import { Context } from '../Context';
import { PassedLog } from '../logs/PassedLog';
import { Action } from './Action';

export class PassAction extends Action {
    constructor(attributes?: { automatic?: boolean }) {
        super({
            type: 'pass',
            required: true,
            automatic: attributes?.automatic ?? false
        });
    }

    perform(context: Context): boolean {
        if (!context.auction) return false;

        context.auction.pass(context.move.player);

        context.log(new PassedLog({ player: context.move.player }));

        return true;
    }
}
