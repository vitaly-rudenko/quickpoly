import type { Action } from './actions/Action';
import type { PropertySpace } from './map/properties/PropertySpace';
import type { Player } from './Player';
import type { Move } from './Move';
import { BidAction } from './actions/BidAction';
import { PassAction } from './actions/PassAction';
import { EndAuctionAction } from './actions/EndAuctionAction';
import { Context } from './Context';

enum Status {
    READY = 'ready',
    BID = 'bid',
    PASSED = 'passed'
}

export class Auction {
    private _initialMove: Move;
    private _propertySpace: PropertySpace;
    private _highestBidAmount: number;
    private _playerStatuses = new Map<Player, Status>();
    private _highestBidder: Player | null = null;
    private _players: Player[];

    constructor(attributes: {
        initialMove: Move,
        players: Player[],
        propertySpace: PropertySpace,
    }) {
        this._propertySpace = attributes.propertySpace;
        this._initialMove = attributes.initialMove;
        this._players = attributes.players;

        for (const player of this._players) {
            this._playerStatuses.set(player, Status.READY);
        }

        this._playerStatuses.set(attributes.initialMove.player, Status.PASSED);
        this._highestBidAmount = this._propertySpace.price;
    }

    bid(player: Player, amount: number): void {
        this._highestBidder = player;
        this._highestBidAmount = amount;

        this._playerStatuses.set(player, Status.BID);
    }

    pass(player: Player): void {
        this._playerStatuses.set(player, Status.PASSED);
    }

    getActions(context: Context): Action[] {
        if (this.isDone()) {
            if (context.move.player === this.initialMove.player) {
                return [new EndAuctionAction()];
            } else {
                return [];
            }
        }

        if (context.move.player === this._initialMove.player) {
            return [];
        }

        if (context.move.player === this._highestBidder) {
            return [];
        }

        if (this._playerStatuses.get(context.move.player) === Status.PASSED) {
            return [];
        }

        return [
            new BidAction(),
            new PassAction(),
        ];
    }

    isDone(): boolean {
        return this.getStatuses().every(s => s !== Status.READY) && (
            this.getStatuses().every(s => s !== Status.PASSED) ||
            this.getStatuses().filter(s => s === Status.BID).length === 1
        );
    }

    private getStatuses(): Status[] {
        return [...this._playerStatuses.values()];
    }

    get highestBidder(): Player | null {
        return this._highestBidder;
    }

    get propertySpace(): PropertySpace {
        return this._propertySpace;
    }

    get highestBidAmount(): number {
        return this._highestBidAmount;
    }

    get initialMove(): Move {
        return this._initialMove;
    }
}
