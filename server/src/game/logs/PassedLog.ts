import { Player } from '../Player';
import { Log } from './Log';

export class PassedLog extends Log {
    private _player: Player;

    constructor(attributes: { player: Player }) {
        super({ type: 'passed' });

        this._player = attributes.player;
    }
}
