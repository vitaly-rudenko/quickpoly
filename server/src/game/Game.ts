import { Space } from './map/Space';
import { Player } from './Player';
import { Action, ActionTypeClass, ActionType } from './actions/Action';
import { Log } from './logs/Log';
import { MoveContext } from './MoveContext';
import { RequiredActionPostponedError } from './actions/RequiredActionPostponedError';
import { Auction } from './Auction';
import { RollDiceAction } from './actions/RollDiceAction';

export class Game {
    private _movePlayer: Player;
    private _performedActions: Action[];

    private _players: Player[];
    private _map: Space[];
    private _logs: Log[] = [];

    private _auction: Auction | null = null;

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

    private _performRequiredActions(): void {
        const movePlayer = this._movePlayer;
        const actions = this._getRequiredActions();

        for (const action of actions) {
            this.performAction(action.type);

            if (movePlayer !== this._movePlayer) { // move changed
                break;
            }
        }
    }

    performAction(type: ActionType): void {
        const action = this.getAvailableActions().find(a => a.type === type);
        if (!action) return;

        try {
            const logs = action.perform(this._createContext(), data);

            this._performedActions.push(action);
            this._logs.push(...logs);
        } catch (error) {
            if (!(error instanceof RequiredActionPostponedError)) {
                throw error;
            }
        }

        this._performRequiredActions();
        this._nextMoveIfNecessary();
    }


    private _getRequiredActions(): Action[] {
        return this.getAvailableActions().filter(a => a.required);
    }

    getAvailableActions(): Action[] {
        return [
            ...this._getMoveSpace().getResidenceActions(this._createContext()),
            new RollDiceAction(),
        ];
    }

    getLogs(): Log[] {
        return this._logs;
    }

    getPerformedActions(): Action[] {
        return this._performedActions;
    }

    private _nextMoveIfNecessary(): void {
        if (this.getAvailableActions().length === 0) {
            this._nextMove();
        }
    }

    private _nextMove(): void {
        const index = this._players.indexOf(this._movePlayer);
        const nextIndex = (index + 1) % this._players.length;

        this._movePlayer = this._players[nextIndex];
        this._performedActions = [];

        this._performRequiredActions();
    }

    private _createContext(): MoveContext {
        return new MoveContext({
            player: this._movePlayer,
            performedActions: this._performedActions,
            map: this._map,
        });
    }

    private _getMoveSpace(): Space {
        return this._map[this._movePlayer.position];
    }

    get movePlayer(): Player {
        return this._movePlayer;
    }
}
