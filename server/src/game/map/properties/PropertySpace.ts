import { Action } from '../../actions/Action';
import { PayPropertyRentAction } from '../../actions/PayPropertyRentAction';
import { PurchasePropertyAction } from '../../actions/PurchasePropertyAction';
import { Context } from '../../Context';
import { Player } from '../../Player';
import { Space } from '../Space';

export abstract class PropertySpace extends Space {
    private _owner: Player | null;
    private _name: string;
    private _price: number;

    constructor(attributes: {
        owner: Player | null,
        type: string,
        name: string,
        price: number,
    }) {
        super({ type: attributes.type });

        this._owner = attributes.owner ?? null;
        this._name = attributes.name;
        this._price = attributes.price;
    }

    makeOwner(player: Player): void {
        this._owner = player;
    }

    getActions(context: Context): Action[] {
        return this._owner
            ? this._owner === context.player
                ? []
                : context.hasBeenPerformed(PayPropertyRentAction)
                    ? []
                    : [new PayPropertyRentAction(this)]
            : [new PurchasePropertyAction(this)];
    }

    abstract calculateRent(): number;

    get price(): number {
        return this._price;
    }

    get owner(): Player | null {
        return this._owner;
    }
}
