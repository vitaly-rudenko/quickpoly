import { Space } from './map/Space';
import { Player } from './Player';
import { Action } from './actions/Action';
import { GiveUpAction } from './actions/GiveUpAction';
import { Log } from './logs/Log';

export class Game {
    private _movePlayer: Player;
    private _players: Player[];
    private _map: Space[];
    private _logs: Log[] = [];

    constructor(state: {
        move: { player: Player },
        players: Player[],
        map: Space[],
    }) {
        this._movePlayer = state.move.player;
        this._players = state.players;
        this._map = state.map;
    }

    getAvailableActions(): Action[] {
        return [
            ...this._getMoveSpace().getActions({ player: this._movePlayer }),
            new GiveUpAction(),
        ];
    }

    performAction<T extends Action>(type: { new(...args: any[]): T }): void {
        const action = this.getAvailableActions().find(a => a instanceof type) as T | undefined;
        if (!action) return;

        this._logs.push(...action.perform({ player: this._movePlayer }));
    }

    getLogs(): Log[] {
        return this._logs;
    }

    private _getMoveSpace(): Space {
        return this._map[this._movePlayer.position];
    }
}
