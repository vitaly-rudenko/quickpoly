import type { Action, ActionType } from './actions/Action';
import type { PropertySpace } from './map/properties/PropertySpace';
import type { Player } from './Player';
import type { Space } from './map/Space';
import { Auction } from './Auction';

export class MoveContext {
    private _map: Space[];
    private _player: Player;
    private _performedActions: Action[];

    constructor(attributes: { map: Space[], player: Player, performedActions: Action[] }) {
        this._map = attributes.map;
        this._player = attributes.player;
        this._performedActions = attributes.performedActions;
    }

    hasActionBeenPerformed(type: ActionType): boolean {
        return this._performedActions.some(action => action.type === type);
    }

    startAuction(propertySpace: PropertySpace): void {
        const auction = new Auction({ propertySpace });
    }

    get movePlayer(): Player {
        return this._player;
    }

    getSpace(position: number): Space {
        return this._map[position];
    }

    getNextPosition(position: number, offset: number): number {
        return (position + offset) % this._map.length;
    }
}
