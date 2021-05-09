import { Player } from '../Player';
import { Log } from './Log';

export class DiceRolledLog extends Log {
    private _player: Player;
    private _dice: [number, number];

    constructor(attributes: { player: Player, dice: [number, number] }) {
        super({ type: 'diceRolled' });

        this._player = attributes.player;
        this._dice = attributes.dice;
    }
}
