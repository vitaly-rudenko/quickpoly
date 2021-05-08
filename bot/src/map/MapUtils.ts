import { ServerGameData } from '../server/ServerGameData';
import { MapSide } from './MapSide';
import { SpaceDirection } from './SpaceDirection';

const sideIndexToSide = [MapSide.TOP, MapSide.RIGHT, MapSide.BOTTOM, MapSide.LEFT];

const sideToDirection: Record<MapSide, SpaceDirection> = {
    [MapSide.TOP]: SpaceDirection.BOTTOM_TO_TOP,
    [MapSide.RIGHT]: SpaceDirection.LEFT_TO_RIGHT,
    [MapSide.BOTTOM]: SpaceDirection.TOP_TO_BOTTOM,
    [MapSide.LEFT]: SpaceDirection.LEFT_TO_RIGHT,
};

export class MapUtils {
    static getSpacePosition(gameData: ServerGameData, index: number): {
        position: number,
        side: MapSide,
        direction: SpaceDirection,
    } {
        const spacesPerSide = gameData.spaces.length / 4;

        const position = index % spacesPerSide;
        const side = sideIndexToSide[Math.floor(index / spacesPerSide)];
        const direction = sideToDirection[side];

        return { position, side, direction };
    }
}
