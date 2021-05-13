const got = require('got');
const htmlParser = require('node-html-parser');

async function parse(url) {
    const response = await got(url);
    const html = response.body;

    const rootEl = htmlParser.parse(html);

    const PRICE_REGEX = /printed +price: \$(\d+)/i;
    const priceEl = rootEl.querySelectorAll('ul > li:first-child')
        .find(el => PRICE_REGEX.test(el.rawText));
    const price = Number(priceEl.rawText.match(PRICE_REGEX)[1]);

    const titleDeedEl = rootEl.querySelector('.toccolours');

    const COLORS = {
        'brown': 'BROWN',
        '#80ccff': 'LIGHT_BLUE',
        'hotpink': 'PINK',
        '#ff8000': 'ORANGE',
        '#ff0000': 'RED',
        'yellow': 'YELLOW',
        'green': 'GREEN',
        '#2020cc': 'BLUE',
    };

    const colorEl = titleDeedEl.querySelector('tbody tr:first-child th');
    const color = COLORS[colorEl.attrs.style
        .split(';')
        .map(s => s.trim())
        .find(s => s.includes('background-color'))
        .match(/background-color: *(.+)/i)[1].toLowerCase()];

    const headerEl = titleDeedEl.querySelector('th b');
    const name = headerEl.childNodes[0].rawText;

    const rentEl = titleDeedEl.querySelector('tr:nth-child(2) td');
    const rent = Number(rentEl.rawText.match(/rent +\$+(\d+)\./i)[1]);

    const houseRentsEl = [1, 2, 3, 4]
        .map(i => titleDeedEl.querySelector(`tr:nth-child(${2 + i}) td:nth-child(2)`).childNodes[0]);
    const houseRents = houseRentsEl.map(
        houseRentEl => Number(houseRentEl.rawText.match(/\$?(\d+)\./)[1])
    );

    const additionalEl = titleDeedEl.querySelector('tbody tr:last-child td');
    const additional = additionalEl.childNodes.map(node => node.rawText).filter(Boolean);

    const hotelRent = Number(additional[0].match(/with +hotel +\$(\d+)/i)[1]);
    const mortgageValue = Number(additional[1].match(/mortgage +value +\$(\d+)\./i)[1]);
    const housePrice = Number(additional[2].match(/houses cost +\$(\d+)\. +each/i)[1]);
    const hotelPrice = Number(additional[3].match(/hotels, +\$(\d+)\. +plus +\d+ +houses/i)[1]);

    return {
        price,
        color,
        name,
        rent,
        houseRents,
        hotelRent,
        mortgageValue,
        housePrice,
        hotelPrice
    };
}

function format({
    price,
    color,
    name,
    rent,
    houseRents,
    hotelRent,
    mortgageValue,
    housePrice,
    hotelPrice
}) {
    return `\
new StreetSpace({
    name: '${name}',
    price: ${price},
    color: StreetColor.${color},
    titleDeed: new StreetTitleDeed({
        baseRent: ${rent},
        perHouseRents: [${houseRents.join(', ')}],
        hotelRent: ${hotelRent},
        mortgageValue: ${mortgageValue},
        housePrice: ${housePrice},
        hotelPrice: ${hotelPrice},
    }),
}),`;
}

async function extractLinks(url) {
    const urlBase = url.split('/wiki')[0];

    const response = await got(url);
    const html = response.body;

    const rootEl = htmlParser.parse(html);

    const linksEl = rootEl.querySelectorAll('.mw-parser-output > ul > li > a');
    const links = linksEl.map(el => urlBase + el.attrs.href);

    return links;
}

async function start() {
    console.log('Fetching links...');

    const links = await extractLinks('https://monopoly.fandom.com/wiki/Property');

    console.log('Counted links:', links.length);

    let success = 0;

    const codes = await Promise.all(links.map(
        async (link) => {
            console.log('Fetching', link);
            try {
                const data = await parse(link);
                const code = format(data);

                console.log('Fetched', link);
                success++;
                return code;
            } catch (error) {
                console.log('Could not parse', link, error);
                return null;
            }
        }
    ));

    console.log(codes.filter(Boolean).join('\n'));
    console.log('Succeeded', success, 'out of', links.length);
}

process.on('unhandledRejection', (error) => console.error(error));

start();
