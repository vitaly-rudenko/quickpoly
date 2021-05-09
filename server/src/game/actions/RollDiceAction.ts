import type { PropertySpace } from '../map/properties/PropertySpace';
import type { MoveContext } from '../MoveContext';
import type { Log } from '../logs/Log';
import { Action, ActionType } from './Action';
import { DiceRolledLog } from '../logs/DiceRolledLog';
import { MovedToSpaceLog } from '../logs/MovedToSpaceLog';

interface RollDiceActionData {
    dice: [number, number];
}

export class RollDiceAction extends Action<RollDiceActionData> {
    private _propertySpace: PropertySpace;

    constructor(propertySpace: PropertySpace) {
        super({ type: ActionType.PAY_PROPERTY_RENT, required: true });

        this._propertySpace = propertySpace;
    }

    perform(context: MoveContext, { dice }: RollDiceActionData): Log[] {
        const position = context.movePlayer.position;
        const nextPosition = context.getNextPosition(position, dice[0] + dice[1]);

        context.movePlayer.moveTo(nextPosition);

        return [
            new DiceRolledLog({
                player: context.movePlayer,
                dice,
            }),
            new MovedToSpaceLog({
                player: context.movePlayer,
                space: context.getSpace(nextPosition),
            }),
        ];
    }
}
