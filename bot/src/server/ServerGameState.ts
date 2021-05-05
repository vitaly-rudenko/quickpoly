import { ServerPlayer } from './ServerPlayer';

export interface ServerGameState {
    spaces: ServerOwnedSpace[],
    players: ServerPlayer[]
}

export interface ServerOwnedSpace {
    index: number,
    ownerId: number,
    houses: number,
    hotel: boolean,
}
