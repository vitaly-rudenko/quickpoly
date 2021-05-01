import canvas from 'canvas';
import { GameState } from './GameState';
import { Space } from './Space';

enum Side {
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
}

enum Direction {
    BOTTOM_TO_TOP = 'bottomToTop',
    TOP_TO_BOTTOM = 'topToBottom',
    LEFT_TO_RIGHT = 'leftToRight',
}

const sideIndexToSide = [Side.TOP, Side.RIGHT, Side.BOTTOM, Side.LEFT];

const sideToDirection: Record<Side, Direction> = {
    [Side.TOP]: Direction.BOTTOM_TO_TOP,
    [Side.RIGHT]: Direction.LEFT_TO_RIGHT,
    [Side.BOTTOM]: Direction.TOP_TO_BOTTOM,
    [Side.LEFT]: Direction.LEFT_TO_RIGHT,
};

const directionToAngle: Record<Direction, number> = {
    [Direction.LEFT_TO_RIGHT]: 0,
    [Direction.BOTTOM_TO_TOP]: -Math.PI / 2,
    [Direction.TOP_TO_BOTTOM]: Math.PI / 2,
};

const typeToName: Record<string, string> = {
    go: 'GO',
    jail: 'Jail',
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

const playerColors = [
    'rgba(220, 17, 0, 0.8)',
    'rgba(220, 80, 30, 0.8)',
    'rgba(180, 180, 0, 0.8)',
    'rgba(0, 137, 36, 0.8)',
    'rgba(0, 112, 137, 0.8)',
    'rgba(21, 0, 137, 0.8)',
    'rgba(137, 0, 114, 0.8)',
    'rgba(0, 0, 0, 0.8)',
];

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

        for (let space = 0; space < this._spaces.length; space++) {
            const { x, y, width, height, direction } = this.getSpaceBoundaries(space);

            this.drawSpace(context, this._spaces[space], {
                x,
                y,
                width,
                height,
                direction,
            });
        }

        context.lineWidth = 3;
        context.strokeRect(
            this._largeSpaceSize, this._largeSpaceSize,
            this._size - this._largeSpaceSize * 2, this._size - this._largeSpaceSize * 2
        );

        this.drawPlayers(context, gameState.players);

        return mapCanvas.toBuffer();
    }

    drawPlayers(
        context: canvas.CanvasRenderingContext2D,
        players: { name: string, space: number }[]
    ): void {
        const perSpaceCount = new Map();

        for (const [i, player] of players.entries()) {
            if (!perSpaceCount.has(player.space)) {
                perSpaceCount.set(player.space, 0);
            }

            const spacePosition = perSpaceCount.get(player.space);
            perSpaceCount.set(player.space, spacePosition + 1);

            const { x, y, width, height, side } = this.getSpaceBoundaries(player.space);
            context.save();
            context.font = `${this._fontSize}px "${this._fontFamily}"`;

            const textBoundaries = this.getTextBoundaries(context, player.name);
            const offset = 5;

            const color = playerColors[i % playerColors.length];

            if (side === Side.TOP) {
                const playerWidth = textBoundaries.width + 40;
                const playerHeight = 30;
                const playerX = x + width / 2;
                const playerY = y + playerHeight / 2 + offset + spacePosition * (playerHeight + offset);

                context.fillStyle = color;
                context.fillRect(playerX - playerWidth / 2, playerY - playerHeight / 2, playerWidth, playerHeight);

                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText('↑ ' + player.name, playerX, playerY);
            } else if (side === Side.RIGHT) {
                const playerWidth = 30;
                const playerHeight = textBoundaries.width + 40;
                const playerX = x + width - playerWidth / 2 - offset - spacePosition * (playerWidth + offset);
                const playerY = y + height / 2;

                context.fillStyle = color;
                context.fillRect(playerX - playerWidth / 2, playerY - playerHeight / 2, playerWidth, playerHeight);

                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.translate(playerX, playerY);
                context.rotate(-Math.PI / 2);
                context.fillText('↓ ' + player.name, 0, 0);
            } else if (side === Side.BOTTOM) {
                const playerWidth = textBoundaries.width + 40;
                const playerHeight = 30;
                const playerX = x + width / 2;
                const playerY = y + height - playerHeight / 2 - offset - spacePosition * (playerHeight + offset);

                context.fillStyle = color;
                context.fillRect(playerX - playerWidth / 2, playerY - playerHeight / 2, playerWidth, playerHeight);

                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText('↓ ' + player.name, playerX, playerY);
            } else {
                const playerWidth = 30;
                const playerHeight = textBoundaries.width + 40;
                const playerX = playerWidth / 2 + offset + spacePosition * (playerWidth + offset);
                const playerY = y + height / 2;

                context.fillStyle = color;
                context.fillRect(playerX - playerWidth / 2, playerY - playerHeight / 2, playerWidth, playerHeight);

                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.translate(playerX, playerY);
                context.rotate(-Math.PI / 2);
                context.fillText('↑ ' + player.name, 0, 0);
            }

            context.restore();
        }
    }

    getSpaceBoundaries(space: number): {
        x: number,
        y: number,
        width: number,
        height: number,
        side: Side,
        direction: Direction
    } {
        const spacesPerSide = this._spaces.length / 4;
        const largeSpaceSize = this._largeSpaceSize;
        const smallSpaceSize = (this._size - this._largeSpaceSize * 2) / (spacesPerSide - 1);

        const position = space % spacesPerSide;
        const side = sideIndexToSide[Math.floor(space / spacesPerSide)];
        const direction = sideToDirection[side];
        const smallestSpaceSize = position === 0 ? largeSpaceSize : smallSpaceSize;

        let x: number, y: number;
        if (side === Side.TOP) {
            x = Math.min(1, position) * largeSpaceSize + Math.max(0, position - 1) * smallSpaceSize;
            y = 0;
        } else if (side === Side.RIGHT) {
            x = this._size - largeSpaceSize;
            y = Math.min(1, position) * largeSpaceSize + Math.max(0, position - 1) * smallSpaceSize;
        } else if (side === Side.BOTTOM) {
            x = this._size - largeSpaceSize - position * smallSpaceSize;
            y = this._size - largeSpaceSize;
        } else {
            x = 0;
            y = this._size - largeSpaceSize - position * smallSpaceSize;
        }

        let width: number, height: number;
        if (direction === Direction.BOTTOM_TO_TOP || direction === Direction.TOP_TO_BOTTOM) {
            [width, height] = [smallestSpaceSize, largeSpaceSize];
        } else {
            [width, height] = [largeSpaceSize, smallestSpaceSize];
        }

        return {
            x,
            y,
            width,
            height,
            side,
            direction,
        };
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
        context.save();

        const label = (space.attributes?.name ?? typeToName[space.type]);

        if (space.attributes?.color) {
            context.fillStyle = streetColorToSpaceColor[space.attributes?.color];
        } else {
            context.fillStyle = 'white';
        }

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
        context.fillText(label, 0, 0);

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
