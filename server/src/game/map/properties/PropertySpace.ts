import type { Player } from '../../Player';
import type { Context } from '../../Context';
import { Space } from '../Space';
import { Action } from '../../actions/Action';
import { PayPropertyRentAction } from '../../actions/PayPropertyRentAction';
import { PurchasePropertyAction } from '../../actions/PurchasePropertyAction';
import { PutPropertyUpForAuctionAction } from '../../actions/PutPropertyUpForAuctionAction';
import { RollDiceAction } from '../../actions/RollDiceAction';

export abstract class PropertySpace extends Space {
    protected _landlord: Player | null;
    protected _name: string;
    protected _price: number;

    constructor(attributes: {
        landlord: Player | null,
        type: string,
        name: string,
        price: number,
    }) {
        super({ type: attributes.type });

        this._landlord = attributes.landlord ?? null;
        this._name = attributes.name;
        this._price = attributes.price;
    }

    abstract calculateRent(): number;

    getResidenceActions(context: Context): Action[] {
        const actions: Action[] = [];

        if (context.move.hasActionBeenPerformed('rollDice')) {
            if (this._landlord) {
                if (
                    this._landlord !== context.move.player &&
                    !context.move.hasActionBeenPerformed('payPropertyRent')
                ) {
                    actions.push(new PayPropertyRentAction(this));
                }
            } else {
                if (
                    context.move.player.canPay(this._price) &&
                    !context.move.hasActionBeenPerformed('purchaseProperty')
                ) {
                    actions.push(new PurchasePropertyAction(this));
                }

                actions.push(new PutPropertyUpForAuctionAction(this));
            }
        } else {
            actions.push(new RollDiceAction());
        }

        return actions;
    }

    setLandlord(player: Player): void {
        this._landlord = player;
    }

    get price(): number {
        return this._price;
    }

    get landlord(): Player | null {
        return this._landlord;
    }
}
