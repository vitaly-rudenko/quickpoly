import canvas from 'canvas';
import { GameState } from './GameState';
import { Space } from './Space';

enum Direction {
    BOTTOM_TO_TOP,
    TOP_TO_BOTTOM,
    LEFT_TO_RIGHT,
}

const sideToDirection = [
    Direction.BOTTOM_TO_TOP, // top
    Direction.LEFT_TO_RIGHT, // right
    Direction.TOP_TO_BOTTOM, // bottom
    Direction.LEFT_TO_RIGHT, // left
];

const directionToAngle: Record<Direction, number> = {
    [Direction.LEFT_TO_RIGHT]: 0,
    [Direction.BOTTOM_TO_TOP]: -Math.PI / 2,
    [Direction.TOP_TO_BOTTOM]: Math.PI / 2,
};

const typeToName: Record<string, string> = {
    go: 'GO',
    jail: 'Jail / Just visiting',
    goToJail: 'Go to Jail',
    freeParking: 'Free Parking',
    busTicket: 'Bus Ticket',
    chance: 'Chance',
    communityChest: 'Community Chest',
    birthdayGift: 'Birthday Gift',
    luxuryTax: 'Luxury Tax',
    incomeTax: 'Income Tax',
    auction: 'Auction',
};

const streetColorToSpaceColor: Record<string, string> = {
    brown: '#D26767',
    lightBlue: '#80CCFF',
    pink: 'hotPink',
    orange: '#FFA041',
    red: '#FF5B5B',
    yellow: '#FFFF75',
    green: '#61CA61',
    blue: '#6E6EFF',
};

export class MapRenderer {
    private _spaces: Space[];
    private _largeSpaceSize: number;
    private _fontFamily: string;
    private _fontSize: number;
    private _size: number;

    constructor(
        spaces: Space[],
        options: {
            size: number,
            largeSpaceSize: number,
            fontFamily: string,
            fontSize: number
        }
    ) {
        this._spaces = spaces;
        this._size = options.size;
        this._largeSpaceSize = options.largeSpaceSize;
        this._fontFamily = options.fontFamily;
        this._fontSize = options.fontSize;
    }

    render(gameState: GameState): Buffer {
        const mapCanvas = canvas.createCanvas(this._size, this._size);
        const context = mapCanvas.getContext('2d');

        const spacesPerSide = this._spaces.length / 4;
        const largeSpaceSize = this._largeSpaceSize;
        const smallSpaceSize = (this._size - this._largeSpaceSize * 2) / (spacesPerSide - 1);

        for (let i = 0; i < this._spaces.length; i++) {
            const space = this._spaces[i];

            const position = i % spacesPerSide;
            const side = Math.floor(i / spacesPerSide);
            const direction = sideToDirection[side];
            const smallestSpaceSize = position === 0 ? largeSpaceSize : smallSpaceSize;

            let x: number, y: number;
            if (side === 0) { // top, horizontal, LTR
                x = Math.min(1, position) * largeSpaceSize + Math.max(0, position - 1) * smallSpaceSize;
                y = 0;
            } else if (side === 1) { // right, vertical, TTB
                x = this._size - largeSpaceSize;
                y = Math.min(1, position) * largeSpaceSize
                    + Math.max(0, position - 1) * smallSpaceSize;
            } else if (side === 2) { // bottom, horizontal, RTL
                x = this._size - largeSpaceSize - position * smallSpaceSize;
                y = this._size - largeSpaceSize;
            } else { // left, vertical, BTT
                x = 0;
                y = this._size - largeSpaceSize - position * smallSpaceSize;
            }

            let width: number, height: number;
            if (direction === Direction.BOTTOM_TO_TOP || direction === Direction.TOP_TO_BOTTOM) {
                [width, height] = [smallestSpaceSize, largeSpaceSize];
            } else {
                [width, height] = [largeSpaceSize, smallestSpaceSize];
            }

            this.drawSpace(context, space, {
                x,
                y,
                width,
                height,
                direction: sideToDirection[side],
            });
        }

        context.lineWidth = 3;
        context.strokeRect(
            this._largeSpaceSize, this._largeSpaceSize,
            this._size - this._largeSpaceSize * 2, this._size - this._largeSpaceSize * 2
        );

        return mapCanvas.toBuffer();
    }

    drawSpace(
        context: canvas.CanvasRenderingContext2D,
        space: Space,
        options: {
            direction: Direction,
            x: number,
            y: number,
            width: number,
            height: number
        }
    ): void {
        const labels = [space.attributes?.name ?? typeToName[space.type]];
        if (space.attributes?.price) {
            labels.push(`$${space.attributes.price}`);
        }

        if (space.attributes?.color) {
            context.fillStyle = streetColorToSpaceColor[space.attributes?.color];
        } else {
            context.fillStyle = 'white';
        }

        context.save();
        context.lineWidth = 3;
        context.fillRect(options.x, options.y, options.width, options.height);
        context.strokeStyle = 'black';
        context.strokeRect(options.x, options.y, options.width, options.height);

        context.fillStyle = 'black';
        context.font = `${this._fontSize}px "${this._fontFamily}"`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.translate(options.x + options.width / 2, options.y + options.height / 2);
        context.rotate(directionToAngle[options.direction]);
        context.fillText(labels[0], 0, 0);
        context.restore();
    }

    getTextBoundaries(
        context: canvas.CanvasRenderingContext2D,
        text: string
    ): { width: number, height: number } {
        const metrics = context.measureText(text);
        return {
            width: metrics.width,
            height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
        };
    }
}
