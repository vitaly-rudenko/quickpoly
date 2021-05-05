import { OwnedSpace } from './OwnedSpace';
import { Player } from './Player';
import { Serializable, SerializableObject } from './utils/Serializable';

export class Game implements Serializable {
    private _ownedSpaces: OwnedSpace[] = [];
    private _players: Player[];

    constructor(attributes: {
        players: Player[],
    }) {
        this._players = attributes.players;
    }

    serialize(): SerializableObject {
        return {
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
        };
    }
}
