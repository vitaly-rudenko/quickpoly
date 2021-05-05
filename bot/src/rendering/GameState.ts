import { Player } from './Player';

export interface GameState {
    move: {
        playerId: string,
    },
    spaces: OwnedSpace[],
    players: Player[]
}

export interface OwnedSpace {
    index: number,
    ownerId: string,
    houses: number,
    hotel: boolean,
}
