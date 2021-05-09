import { Space } from './map/Space';
import { Player } from './Player';
import { Action, ActionType } from './actions/Action';
import { Log } from './logs/Log';
import { Context } from './Context';
import { DiceRolledLog } from './logs/DiceRolledLog';
import { RequiredActionPostponedError } from './actions/RequiredActionPostponedError';

export class Game {
    private _movePlayer: Player;
    private _performedActions: Action[];

    private _players: Player[];
    private _map: Space[];
    private _logs: Log[] = [];

    constructor(state: {
        move: { player: Player },
        players: Player[],
        map: Space[],
    }) {
        this._movePlayer = state.move.player;
        this._performedActions = [];

        this._players = state.players;
        this._map = state.map;
    }

    start(): void {
        this._performRequiredActions();
    }

    rollDice(dice: [number, number]): void {
        this._movePlayer.moveTo(
            (this._movePlayer.position + dice[0] + dice[1]) % this._map.length
        );

        this._logs.push(
            new DiceRolledLog({
                player: this._movePlayer,
                dice,
            })
        );

        this._performRequiredActions();
    }

    getAvailableActions(): Action[] {
        return [
            ...this._getMoveSpace().getLandActions(
                new Context({
                    player: this._movePlayer,
                    performedActions: this._performedActions,
                })
            ),
        ];
    }

    private _performRequiredActions(): void {
        const actions = this.getAvailableActions().filter(a => a.required);

        for (const action of actions) {
            this.performAction(action.type);
        }
    }

    performAction(type: ActionType): void {
        const action = this.getAvailableActions().find(a => a.type === type);
        if (!action) return;

        try {
            const logs = action.perform(
                new Context({
                    player: this._movePlayer,
                    performedActions: this._performedActions,
                })
            );

            this._performedActions.push(action);
            this._logs.push(...logs);
        } catch (error) {
            if (!(error instanceof RequiredActionPostponedError)) {
                throw error;
            }
        }
    }

    getLogs(): Log[] {
        return this._logs;
    }

    getPerformedActions(): Action[] {
        return this._performedActions;
    }

    private _getMoveSpace(): Space {
        return this._map[this._movePlayer.position];
    }
}
