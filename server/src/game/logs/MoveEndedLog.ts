import { Player } from '../Player';
import { Log } from './Log';

export class MoveEndedLog extends Log {
    private _player: Player;

    constructor(attributes: { player: Player }) {
        super({ type: 'moveEnded' });
        this._player = attributes.player;
    }
}
