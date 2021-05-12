import type { Log } from './logs/Log';
import type { Auction } from './Auction';
import type { Move } from './Move';

export interface ContextHandler {
    log(log: Log): void;
    startAuction(auction: Auction): void;
    endAuction(): void;
}
