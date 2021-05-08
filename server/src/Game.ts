import { GameClient } from './GameClient';
import { GameData } from './GameData';
import { OwnedSpace } from './OwnedSpace';
import { Player } from './Player';
import { Server } from './Server';
import { UpdateLog } from './UpdateLog';
import { Serializable, SerializableObject } from './utils/Serializable';

export class Game implements Serializable {
    private _gameData: GameData;
    private _ownedSpaces: OwnedSpace[] = [];
    private _moveTimeoutMs: number;
    private _players: Player[];
    private _movePlayer: Player;
    private _moveStartedAt: number;
    private _gameClient: GameClient;
    private _updateLogs: UpdateLog[] = [];

    constructor(
        attributes: {
            players: Player[],
            moveTimeoutMs: number,
            gameData: GameData,
        },
        dependencies: {
            gameClient: GameClient,
        }
    ) {
        this._gameClient = dependencies.gameClient;
        this._gameData = attributes.gameData;
        this._players = attributes.players;
        this._moveTimeoutMs = attributes.moveTimeoutMs;
        this._movePlayer = this._players[0];
        this._moveStartedAt = Date.now();
    }

    move(dice: [number, number]): void {
        this._movePlayer.space += (dice[0] + dice[1]) % this._gameData.spaces.length;
        const space = this._gameData.spaces[this._movePlayer.space];
        console.log('Rolled dice:', dice);
        console.log('Updated player info:', this._movePlayer);
        this._updateLogs.push({
            message: this._movePlayer.name
                + ' rolled dice (' + dice[0] + ', ' + dice[1] + ') and landed on ' + space.serialize().name,
        });

        this._movePlayer = this._players[(this._movePlayer.index + 1) % this._players.length];
        console.log('Next player is:', this._movePlayer);

        this._gameClient.emitRemoteEvent('gameStateUpdated', this.serialize());
    }

    getData(): GameData {
        return this._gameData;
    }

    serialize(): SerializableObject {
        return {
            move: {
                playerId: this._movePlayer.id,
                timesOutAt: this._moveStartedAt + this._moveTimeoutMs,
            },
            spaces: this._ownedSpaces.map(space => ({
                index: space.index,
                ownerId: space.ownerId,
                houses: space.houses,
                hotel: space.hotel,
            })),
            players: this._players.map(player => ({
                id: player.id,
                index: player.index,
                name: player.name,
                space: player.space,
                money: player.money,
            })),
            gameData: {
                spaces: this._gameData.spaces.map(s => s.serialize()),
            },
            updateLogs: this._updateLogs.map(updateLog => ({
                message: updateLog.message,
            })),
        };
    }
}
