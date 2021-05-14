import { Space } from './map/Space';
import { Player } from './Player';
import { Action } from './actions/Action';
import { Log } from './logs/Log';
import { Context } from './Context';
import { ContextHandler } from './ContextHandler';
import { Auction } from './Auction';
import { Move } from './Move';
import { GiveUpAction } from './actions/GiveUpAction';
import { EndMoveAction } from './actions/EndMoveAction';
import { MoveEndedLog } from './logs/MoveEndedLog';

export class Game implements ContextHandler {
    private _move: Move;

    private _players: Player[];
    private _map: Space[];
    private _logs: Log[];

    private _auction: Auction | null = null;

    constructor(state: {
        move: Move,
        players: Player[],
        map: Space[],
    }) {
        this._move = state.move;
        this._logs = [];

        this._players = state.players;
        this._map = state.map;
    }

    startAuction(auction: Auction): void {
        this._auction = auction;
    }
    endAuction(): void {
        this._auction = null;
    }

    log(log: Log): void {
        this._logs.push(log);
        this._move.log(log);
    }

    private _performAutomaticActions(): void {
        const move = this._move;
        const actions = this._getAutomaticActions();

        for (const action of actions) {
            this._performAction(action);

            if (move !== this._move) {
                break;
            }
        }

        this._nextMoveIfNecessary();
    }

    performAction(type: string, data?: any): void {
        const action = this.getAvailableActions()
            .find(a => a.type === type && a.applies(data));

        if (!action) {
            throw new Error(`Action is not available: ${type}`);
        }

        this._performAction(action, data);
        this._performAutomaticActions();
    }

    private _performAction(action: Action, data?: any): void {
        const success = action.perform(this._createContext(), data);

        if (success) {
            this._move.storeAction(action);
            this._nextMoveIfNecessary();
        }
    }

    private _getAutomaticActions(): Action[] {
        return this.getAvailableActions().filter(a => a.automatic);
    }

    getAvailableActions(): Action[] {
        if (this._move.hasActionBeenPerformed('endMove')) {
            return [];
        }

        const context = this._createContext();
        const actions: Action[] = [];

        if (this._auction !== null) {
            actions.push(...this._auction.getActions(context));
        }

        actions.push(...this._getMoveSpace().getResidenceActions(context));

        actions.push(
            ...this._map
                .map(space => space.getGlobalActions(context))
                .reduce((acc, curr) => (acc.push(...curr), acc), [])
        );

        actions.push(new GiveUpAction());

        if (
            actions.length > 0 &&
            actions.some(a => !a.skippable) &&
            actions.every(a => !a.required)
        ) {
            actions.push(new EndMoveAction());
        }

        return actions;
    }

    get logs(): Log[] {
        return this._logs;
    }

    private _nextMoveIfNecessary(): void {
        if (this.getAvailableActions().every(a => a.skippable)) {
            // console.log('Move #' + this._move.number
            //     + ' of ' + this._move.player.id
            //     + ' has ended'
            //     + '\n   with actions: [' + this._move.actions.map(a => a.constructor.name).join(', ') + ']'
            //     + '\n       and logs: [' + this._move.logs.map(a => a.constructor.name).join(', ') + ']');

            this._nextMove();
        }
    }

    private _nextMove(): void {
        const index = this._players.indexOf(this._move.player);
        const nextIndex = (index + 1) % this._players.length;

        this._move = new Move({
            number: this._move.number + 1,
            player: this._players[nextIndex],
        });

        this._performAutomaticActions();
    }

    private _createContext(): Context {
        return new Context({
            move: this._move,
            map: this._map,
            auction: this._auction,
            players: this._players,
        }, this);
    }

    private _getMoveSpace(): Space {
        return this._map[this._move.player.position];
    }

    get move(): Move {
        return this._move;
    }
}
