export abstract class Log {
    protected _type: string;

    constructor(attributes: { type: string }) {
        this._type = attributes.type;
    }
}
