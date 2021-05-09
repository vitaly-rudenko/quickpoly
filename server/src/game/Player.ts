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

    canPay(amount: number): boolean {
        return this._money >= amount;
    }

    charge(amount: number): void {
        this._money -= amount;
    }

    topUp(amount: number): void {
        this._money += amount;
    }

    moveTo(position: number): void {
        this._position = position;
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
