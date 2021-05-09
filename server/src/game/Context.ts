import type { Action, ActionType } from './actions/Action';
import type { Player } from './Player';

export class Context {
    private _player: Player;
    private _performedActions: Action[];

    constructor(attributes: { player: Player, performedActions: Action[] }) {
        this._player = attributes.player;
        this._performedActions = attributes.performedActions;
    }

    hasActionBeenPerformed(type: ActionType): boolean {
        return this._performedActions.some(action => action.type === type);
    }

    get player(): Player {
        return this._player;
    }
}
