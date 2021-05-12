import { Player } from '../Player';
import { Log } from './Log';

export class BidLog extends Log {
    private _player: Player;
    private _amount: number;

    constructor(attributes: { player: Player, amount: number }) {
        super({ type: 'bid' });

        this._player = attributes.player;
        this._amount = attributes.amount;
    }
}
