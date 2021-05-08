import { Action } from './Action';

export class GiveUpAction extends Action {
    constructor() {
        super({ type: 'giveUp' });
    }
}
