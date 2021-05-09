import { Action, ActionType } from '../../actions/Action';
import { PayPropertyRentAction } from '../../actions/PayPropertyRentAction';
import { PurchasePropertyAction } from '../../actions/PurchasePropertyAction';
import { Context } from '../../Context';
import { Player } from '../../Player';
import { Space } from '../Space';

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

    getLandActions(context: Context): Action[] {
        return this._landlord
            ? this._landlord === context.player
                ? []
                : context.hasActionBeenPerformed(ActionType.PAY_PROPERTY_RENT)
                    ? []
                    : [new PayPropertyRentAction(this)]
            : [new PurchasePropertyAction(this)];
    }

    abstract calculateRent(): number;

    get price(): number {
        return this._price;
    }

    get landlord(): Player | null {
        return this._landlord;
    }
}
