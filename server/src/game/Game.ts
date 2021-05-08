import { Space } from './map/Space';
import { Player } from './Player';
import { Action } from './actions/Action';
import { Log } from './logs/Log';
import { Context } from './Context';

export class Game {
    private _movePlayer: Player;
    private _performedMoveActions: Action[];

    private _players: Player[];
    private _map: Space[];
    private _logs: Log[] = [];

    constructor(state: {
        move: { player: Player },
        players: Player[],
        map: Space[],
    }) {
        this._movePlayer = state.move.player;
        this._performedMoveActions = [];

        this._players = state.players;
        this._map = state.map;
    }

    start(): void {
        this._performRequiredActions();
    }

    getAvailableActions(): Action[] {
        return [
            ...this._getMoveSpace().getActions(
                new Context({
                    player: this._movePlayer,
                    performedMoveActions: this._performedMoveActions,
                })
            ),
        ];
    }

    _performRequiredActions(): void {
        const actions = this.getAvailableActions().filter(a => a.required);

        for (const action of actions) {
            this.performAction(action.type);
        }
    }

    performAction(type: string): void {
        const action = this.getAvailableActions().find(a => a.type === type);
        if (!action) return;

        const logs = action.perform(
            new Context({
                player: this._movePlayer,
                performedMoveActions: this._performedMoveActions,
            })
        );

        this._performedMoveActions.push(action);
        this._logs.push(...logs);
    }

    getLogs(): Log[] {
        return this._logs;
    }

    private _getMoveSpace(): Space {
        return this._map[this._movePlayer.position];
    }
}
