import { Space } from '../map/Space';
import { Player } from '../Player';
import { Log } from './Log';

export class MovedToSpaceLog extends Log {
    private _player: Player;
    private _space: Space;

    constructor(attributes: { player: Player, space: Space }) {
        super({ type: 'movedToSpace' });

        this._player = attributes.player;
        this._space = attributes.space;
    }
}
