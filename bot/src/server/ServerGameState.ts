import { ServerGameData } from './ServerGameData';
import { ServerPlayer } from './ServerPlayer';

export interface ServerGameState {
    move: {
        playerId: number,
        timesOutAt: number,
    },
    spaces: ServerOwnedSpace[],
    players: ServerPlayer[],
    gameData: ServerGameData,
}

export interface ServerOwnedSpace {
    index: number,
    ownerId: number,
    houses: number,
    hotel: boolean,
}
