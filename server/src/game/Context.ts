import type { Player } from './Player';
import type { Space } from './map/Space';
import type { Auction } from './Auction';
import { Log } from './logs/Log';
import { ContextHandler } from './ContextHandler';
import { Move } from './Move';

export class Context {
    private _map: Space[];
    private _move: Move;
    private _contextHandler: ContextHandler;
    private _auction: Auction | null;
    private _players: Player[];

    constructor(
        attributes: {
            map: Space[],
            move: Move,
            auction: Auction | null,
            players: Player[],
        },
        contextHandler: ContextHandler
    ) {
        this._map = attributes.map;
        this._move = attributes.move;
        this._auction = attributes.auction;
        this._players = attributes.players;

        this._contextHandler = contextHandler;
    }

    startAuction(auction: Auction): void {
        this._contextHandler.startAuction(auction);
    }

    endAuction(): void {
        this._contextHandler.endAuction();
    }

    log(log: Log): void {
        this._contextHandler.log(log);
    }

    get map(): Space[] {
        return this._map;
    }

    get move(): Move {
        return this._move;
    }

    get auction(): Auction | null {
        return this._auction;
    }

    get players(): Player[] {
        return this._players;
    }

    getSpace(position: number): Space {
        return this._map[position];
    }

    getNextPosition(position: number, offset: number): number {
        return (position + offset) % this._map.length;
    }
}
