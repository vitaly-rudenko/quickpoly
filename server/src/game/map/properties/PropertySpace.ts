import type { MoveContext } from '../../MoveContext';
import type { Player } from '../../Player';
import { Action, ActionType } from '../../actions/Action';
import { Space } from '../Space';
import { PayPropertyRentAction } from '../../actions/PayPropertyRentAction';
import { PurchasePropertyAction } from '../../actions/PurchasePropertyAction';
import { PutPropertyUpForAuctionAction } from '../../actions/PutPropertyUpForAuctionAction';

export abstract class PropertySpace extends Space {
    private _landlord: Player | null;
    private _name: string;
    private _price: number;

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

    setLandlord(player: Player): void {
        this._landlord = player;
    }

    getResidenceActions(context: MoveContext): Action[] {
        const actions: Action[] = [];

        if (this._landlord) {
            if (
                this._landlord !== context.movePlayer &&
                !context.hasActionBeenPerformed(ActionType.PAY_PROPERTY_RENT)
            ) {
                actions.push(new PayPropertyRentAction(this));
            }
        } else {
            if (
                context.movePlayer.canPay(this._price) &&
                !context.hasActionBeenPerformed(ActionType.PURCHASE_PROPERTY)
            ) {
                actions.push(new PurchasePropertyAction(this));
            }

            actions.push(new PutPropertyUpForAuctionAction(this));
        }

        return actions;
    }

    abstract calculateRent(): number;

    get price(): number {
        return this._price;
    }

    get landlord(): Player | null {
        return this._landlord;
    }
}
