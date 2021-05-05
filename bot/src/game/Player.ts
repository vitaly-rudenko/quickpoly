export class Player {
    private _id: number;
    private _name: string;

    constructor(attributes: {
        id: number,
        name: string
    }) {
        this._id = attributes.id;
        this._name = attributes.name;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }
}
