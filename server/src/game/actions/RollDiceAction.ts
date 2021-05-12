import type { Context } from '../Context';
import { Action } from './Action';
import { DiceRolledLog } from '../logs/DiceRolledLog';
import { MovedToSpaceLog } from '../logs/MovedToSpaceLog';

export class RollDiceAction extends Action {
    constructor() {
        super({ type: 'rollDice', required: true });
    }

    perform(context: Context, data: { dice: [number, number] }): boolean {
        const position = context.move.player.position;
        const nextPosition = context.getNextPosition(position, data.dice[0] + data.dice[1]);

        context.move.player.moveTo(nextPosition);

        context.log(
            new DiceRolledLog({
                player: context.move.player,
                dice: data.dice,
            })
        );

        context.log(
            new MovedToSpaceLog({
                player: context.move.player,
                space: context.getSpace(nextPosition),
            })
        );

        return true;
    }
}
