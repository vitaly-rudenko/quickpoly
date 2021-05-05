import { ServerPlayer } from './ServerPlayer';

export interface ServerGameState {
    move: {
        playerId: string,
    },
    spaces: ServerOwnedSpace[],
    players: ServerPlayer[]
}

export interface ServerOwnedSpace {
    index: number,
    ownerId: string,
    houses: number,
    hotel: boolean,
}
