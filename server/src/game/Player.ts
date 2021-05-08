export class Player {
    private _id: string;
    private _position: number;
    private _money: number;

    constructor(attributes: {
        id: string,
        position: number,
        money: number,
    }) {
        this._id = attributes.id;
        this._position = attributes.position;
        this._money = attributes.money;
    }

    charge(amount: number): void {
        this._money -= amount;
    }

    get id(): string {
        return this._id;
    }

    get position(): number {
        return this._position;
    }

    get money(): number {
        return this._money;
    }
}
