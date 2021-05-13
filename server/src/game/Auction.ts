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
        initialBidAmount: number,
        players: Player[],
        propertySpace: PropertySpace,
    }) {
        this._propertySpace = attributes.propertySpace;
        this._initialMove = attributes.initialMove;
        this._players = attributes.players;

        this._highestBidAmount = attributes.initialBidAmount;
        for (const player of this._players) {
            this._playerStatuses.set(player, Status.READY);
        }
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
        if (context.move.number === this._initialMove.number) {
            return [];
        }

        if (this.isDone()) {
            if (context.move.player === this._initialMove.player) {
                return [new EndAuctionAction()];
            } else {
                return [];
            }
        }

        if (context.move.player === this._highestBidder) {
            return [];
        }

        if (this._playerStatuses.get(context.move.player) === Status.PASSED) {
            return [];
        }

        if (context.move.player.canPay(this._highestBidAmount + 1)) {
            return [new BidAction(), new PassAction()];
        }

        return [new PassAction({ automatic: true })];
    }

    isDone(): boolean {
        return this.getStatuses().every(s => s !== Status.READY) && (
            this.getStatuses().every(s => s === Status.PASSED) ||
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
}
