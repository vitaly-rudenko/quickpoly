export interface GameState {
    move: {
        playerId: string,
    },
    players: {
        id: string,
        name: string,
        space: number,
    }[]
}
