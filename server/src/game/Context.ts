import type { Action } from './actions/Action';
import type { Player } from './Player';

export class Context {
    private _player: Player;
    private _performedMoveActions: Action[];

    constructor(attributes: { player: Player, performedMoveActions: Action[] }) {
        this._player = attributes.player;
        this._performedMoveActions = attributes.performedMoveActions;
    }

    hasBeenPerformed(actionClass: { new(...args: any[]): Action }): boolean {
        return this._performedMoveActions
            .some(action => action instanceof actionClass);
    }

    get player(): Player {
        return this._player;
    }
}
