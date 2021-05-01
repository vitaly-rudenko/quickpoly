import canvas from 'canvas';
import { GameState, OwnedSpace } from './GameState';
import { Player } from './Player';
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
    brown: '#f5a9a9',
    lightBlue: '#bde4ff',
    pink: '#ffc2e0',
    orange: '#ffcb96',
    red: '#ffb5b5',
    yellow: '#fffbb5',
    green: '#a9f5a9',
    blue: '#c4d0ff',
};

const playerColors = [
    [220, 17, 0], // red
    [21, 0, 137], // blue
    [0, 137, 36], // green
    [180, 180, 0], // yellow
    [0, 112, 137], // light blue
    [137, 0, 114], // purple
    [220, 80, 30], // orange
    [0, 140, 126], // teal
];

const int = Math.trunc;

export class MapRenderer {
    private _spaces: Space[];
    private _largeSpaceSize: number;
    private _fontFamily: string;
    private _fontSize: number;
    private _size: number;

    constructor(
        spaces: Space[],
        options: { fontFamily: string }
    ) {
        this._spaces = spaces;
        this._size = 2048;
        this._largeSpaceSize = 436;
        this._fontSize = 34;
        this._fontFamily = options.fontFamily;
    }

    render(gameState: GameState): Buffer {
        const mapCanvas = canvas.createCanvas(this._size, this._size);
        const context = mapCanvas.getContext('2d');

        for (let index = 0; index < this._spaces.length; index++) {
            const { x, y, width, height, side, direction } = this.getSpaceBoundaries(index);

            const ownedSpace = gameState.spaces.find(space => space.index === index);
            const player = ownedSpace && gameState.players.find(p => p.id === ownedSpace.ownerId);

            this.drawSpace(context, this._spaces[index], ownedSpace, player, {
                x,
                y,
                width,
                height,
                side,
                direction,
            });
        }

        context.lineWidth = 4;
        context.strokeRect(
            this._largeSpaceSize, this._largeSpaceSize,
            int(this._size - this._largeSpaceSize * 2), int(this._size - this._largeSpaceSize * 2)
        );

        this.drawPlayers(context, gameState.players);

        return mapCanvas.toBuffer();
    }

    drawPlayers(
        context: canvas.CanvasRenderingContext2D,
        players: Player[]
    ): void {
        const perSpaceCount = new Map();

        for (const player of players) {
            if (!perSpaceCount.has(player.space)) {
                perSpaceCount.set(player.space, 0);
            }

            const spacePosition = perSpaceCount.get(player.space);
            perSpaceCount.set(player.space, spacePosition + 1);

            const { x, y, width, height, side } = this.getSpaceBoundaries(player.space);
            context.save();
            context.font = `${this._fontSize}px "${this._fontFamily}"`;

            const playerName = player.name.length > 10
                ? (player.name.slice(0, 10) + '...')
                : player.name;
            const textBoundaries = this.getTextBoundaries(context, ' ↑ ' + playerName);
            const offset = 2;
            const centerOffset = 26;
            const spaceOffset = 25;
            const iconRadius = 14;
            const iconOffset = iconRadius * 2 + 5;

            const nameColor = this.getPlayerColor(player.index, 0.7);
            const iconColor = this.getPlayerColor(player.index);

            if (side === Side.TOP) {
                const playerWidth = int(textBoundaries.width + 20);
                const playerHeight = int(this._fontSize + 20);
                const playerX = int(x + width / 2 - centerOffset);
                const playerY = int(y + height + offset + spacePosition * playerHeight);

                context.fillStyle = nameColor;
                context.fillRect(playerX, playerY, playerWidth, playerHeight);

                context.beginPath();
                context.strokeStyle = 'white';
                context.fillStyle = iconColor;
                context.arc(
                    x + width - spaceOffset, y + height - spaceOffset - iconOffset * spacePosition,
                    iconRadius, 0, Math.PI * 2
                );
                context.fill();

                context.fillStyle = 'white';
                context.textAlign = 'left';
                context.textBaseline = 'top';
                context.fillText(' ↑ ' + playerName, playerX, playerY);
            } else if (side === Side.RIGHT) {
                const playerWidth = int(this._fontSize + 20);
                const playerHeight = int(textBoundaries.width + 20);
                const playerX = int(x - playerWidth - offset - spacePosition * playerWidth);
                const playerY = int(y + height / 2 - centerOffset);

                context.fillStyle = nameColor;
                context.fillRect(playerX, playerY, playerWidth, playerHeight);

                context.beginPath();
                context.strokeStyle = 'white';
                context.fillStyle = iconColor;
                context.arc(
                    x + spaceOffset + iconOffset * spacePosition, y + height - spaceOffset,
                    iconRadius, 0, Math.PI * 2
                );
                context.fill();

                context.fillStyle = 'white';
                context.textAlign = 'right';
                context.textBaseline = 'top';
                context.translate(playerX, playerY);
                context.rotate(-Math.PI / 2);
                context.fillText(playerName + ' ↓ ', 0, 0);
            } else if (side === Side.BOTTOM) {
                const playerWidth = int(textBoundaries.width + 30);
                const playerHeight = int(this._fontSize + 20);
                const playerX = int(x - playerWidth + width / 2 + centerOffset);
                const playerY = int(y - playerHeight - offset - spacePosition * playerHeight);

                context.fillStyle = nameColor;
                context.fillRect(playerX, playerY, playerWidth, playerHeight);

                context.beginPath();
                context.strokeStyle = 'white';
                context.fillStyle = iconColor;
                context.arc(
                    x + spaceOffset, y + spaceOffset + iconOffset * spacePosition,
                    iconRadius, 0, Math.PI * 2
                );
                context.fill();

                context.fillStyle = 'white';
                context.textAlign = 'right';
                context.textBaseline = 'top';
                context.fillText(playerName + ' ↓ ', playerX + playerWidth, playerY);
            } else {
                const playerWidth = int(this._fontSize + 20);
                const playerHeight = int(textBoundaries.width + 30);
                const playerX = int(width + offset + spacePosition * playerWidth);
                const playerY = int(y + height - playerHeight - centerOffset);

                context.fillStyle = nameColor;
                context.fillRect(playerX, playerY, playerWidth, playerHeight);

                context.beginPath();
                context.strokeStyle = 'white';
                context.fillStyle = iconColor;
                context.arc(
                    x + width - spaceOffset - iconOffset * spacePosition, y + height - spaceOffset,
                    iconRadius, 0, Math.PI * 2
                );
                context.fill();

                context.fillStyle = 'white';
                context.textAlign = 'left';
                context.textBaseline = 'top';
                context.translate(playerX, playerY + playerHeight);
                context.rotate(-Math.PI / 2);
                context.fillText(' ↑ ' + playerName, 0, 0);
            }

            context.restore();
        }
    }

    getSpaceBoundaries(index: number): {
        x: number,
        y: number,
        width: number,
        height: number,
        side: Side,
        direction: Direction
    } {
        const spacesPerSide = this._spaces.length / 4;
        const largeSpaceSize = this._largeSpaceSize;
        const smallSpaceSize = int((this._size - this._largeSpaceSize * 2) / (spacesPerSide - 1));

        const position = index % spacesPerSide;
        const side = sideIndexToSide[Math.floor(index / spacesPerSide)];
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
        ownedSpace: OwnedSpace | undefined,
        owner: Player | undefined,
        options: {
            direction: Direction,
            side: Side,
            x: number,
            y: number,
            width: number,
            height: number
        }
    ): void {
        context.save();

        const label = (space.attributes?.name ?? typeToName[space.type]);
        const additionalInfo: string[] = [];

        if (space.attributes?.price) {
            additionalInfo.push('$' + space.attributes.price);
        }

        const colorSize = 40;
        context.lineWidth = 4;

        if (owner && ownedSpace) {
            context.fillStyle = this.getPlayerColor(owner.index, 0.7);

            if (options.side === Side.TOP) {
                context.fillRect(
                    options.x, options.y,
                    options.width, colorSize
                );
            } else if (options.side === Side.RIGHT) {
                context.fillRect(
                    options.x + (options.width - colorSize), options.y,
                    colorSize, options.height
                );
            } else if (options.side === Side.BOTTOM) {
                context.fillRect(
                    options.x, options.y + (options.height - colorSize),
                    options.width, colorSize
                );
            } else {
                context.fillRect(
                    options.x, options.y,
                    colorSize, options.height
                );
            }

            if (ownedSpace.hotel) {
                additionalInfo.push('+ hotel');

                const offset = 20;

                let x: number, y: number;
                if (options.side === Side.TOP) {
                    x = options.x + options.width / 2;
                    y = options.y + offset;
                } else if (options.side === Side.RIGHT) {
                    x = options.x + options.width - offset;
                    y = options.y + options.height / 2;
                } else if (options.side === Side.BOTTOM) {
                    x = options.x + options.width / 2;
                    y = options.y + options.height - offset;
                } else {
                    x = options.x + offset;
                    y = options.y + options.height / 2;
                }

                context.beginPath();
                context.fillStyle = 'white';
                context.arc(int(x), int(y), 12, 0, Math.PI * 2);
                context.fill();
            } else if (ownedSpace.houses > 0) {
                additionalInfo.push('+ ' + ownedSpace.houses + (ownedSpace.houses > 1 ? ' houses' : ' house'));

                const size = 12;
                const mapOffset = 14;
                const offset = 8;
                const length = ownedSpace.houses * (size + offset) - offset;

                let x: number, y: number;
                let xOffset = 0;
                let yOffset = 0;
                if (options.side === Side.TOP) {
                    x = options.x + (options.width - length) / 2;
                    y = options.y + mapOffset;
                    xOffset = size + offset;
                } else if (options.side === Side.RIGHT) {
                    x = options.x + options.width - size - mapOffset;
                    y = options.y + (options.height - length) / 2;
                    yOffset = size + offset;
                } else if (options.side === Side.BOTTOM) {
                    x = options.x + (options.width - length) / 2;
                    y = options.y + options.height - size - mapOffset;
                    xOffset = size + offset;
                } else {
                    x = options.x + mapOffset;
                    y = options.y + (options.height - length) / 2;
                    yOffset = size + offset;
                }

                for (let house = 0; house < ownedSpace.houses; house++) {
                    context.fillStyle = 'white';
                    context.fillRect(int(x + xOffset * house), int(y + yOffset * house), size, size);
                }
            }
        }

        if (space.attributes?.color) {
            context.fillStyle = streetColorToSpaceColor[space.attributes?.color];

            if (options.side === Side.TOP) {
                context.fillRect(
                    options.x, options.y + (options.height - colorSize),
                    options.width, colorSize
                );
            } else if (options.side === Side.RIGHT) {
                context.fillRect(
                    options.x, options.y,
                    colorSize, options.height
                );
            } else if (options.side === Side.BOTTOM) {
                context.fillRect(
                    options.x, options.y,
                    options.width, colorSize
                );
            } else {
                context.fillRect(
                    options.x + (options.width - colorSize), options.y,
                    colorSize, options.height
                );
            }
        }

        context.strokeStyle = 'black';
        context.strokeRect(options.x, options.y, options.width, options.height);

        context.fillStyle = 'black';
        context.font = `${this._fontSize}px "${this._fontFamily}"`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.translate(int(options.x + options.width / 2), int(options.y + options.height / 2));
        context.rotate(directionToAngle[options.direction]);
        context.fillText(label, 0, additionalInfo.length > 0 ? int(-this._fontSize / 2 - 4) : 0);

        if (additionalInfo.length > 0) {
            context.font = `${int(this._fontSize * 0.8)}px "${this._fontFamily}"`;
            context.fillStyle = 'rgba(0, 0, 0, 0.8)';
            context.fillText(additionalInfo.join(' '), 0, int(this._fontSize / 2 + 4));
        }

        context.restore();
    }

    getPlayerColor(index: number, opacity = 1): string {
        const [r, g, b] = playerColors[index % playerColors.length];
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
