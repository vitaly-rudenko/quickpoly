import type { Action } from './actions/Action';
import type { Log } from './logs/Log';
import type { Player } from './Player';

export class Move {
    private _number: number;
    private _player: Player;
    private _logs: Log[];
    private _actions: Action[];

    constructor(attributes: {
        number?: number,
        player: Player,
    }) {
        this._number = attributes.number ?? 1;
        this._player = attributes.player;
        this._logs = [];
        this._actions = [];
    }

    log(log: Log): void {
        this._logs.push(log);
    }

    storeAction(action: Action): void {
        this._actions.push(action);
    }

    hasActionBeenPerformed(type: string): boolean {
        return this._actions.some(action => action.type === type);
    }

    get number(): number {
        return this._number;
    }

    get player(): Player {
        return this._player;
    }

    get logs(): Log[] {
        return this._logs;
    }

    get actions(): Action[] {
        return this._actions;
    }
}
