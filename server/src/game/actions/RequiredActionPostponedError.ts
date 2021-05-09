export class RequiredActionPostponedError extends Error {
    constructor() {
        super('Could not perform required action');
    }
}
