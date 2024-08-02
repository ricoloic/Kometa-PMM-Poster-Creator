let font;
let index = 0;
let zip;
let cvn;
const ENABLE_SAVING = true;
const WAIT_TIME = 250;
const COLORS = [
    "#FF5733",
    "#3357FF",
    "#FF33A1",
    "#FF8C33",
    "#8C33FF",
    "#FF3333",
    "#FF33F5",
    "#33A1FF",
    "#DB33FF",
    "#FFDB33",
    "#337BFF",
    "#FF337B",
    "#7BFF33",
    "#FF5733",
    "#5733FF",
    "#7B33FF",
    "#FF5733",
    "#33A1FF",
    "#A1FF33",
    "#FF33A1",
    "#33FFA1",
    "#FFA133"
]

function preload() {
    font = loadFont('/FFGoodProCond-Medium.ttf');
}

function setup() {
    zip = new JSZip();
    cvn = createCanvas(600, 900);
    createPoster();
}

async function createPoster() {
    const poster = POSTERS[index];
    console.log(poster);

    const builder = PosterBuilder.init(poster.type ?? 'default');
    if (poster.url) {
        await builder.url(poster.url);
        builder.overlay(false);
    } else if (poster.color) {
        builder.color(poster.color);
        builder.overlay(true);
    } else {
        builder.color(COLORS[Math.floor(Math.random() * COLORS.length)]);
        builder.overlay(true);
    }
    if (poster.lines) builder.text(poster.lines);
    builder.side();

    if (ENABLE_SAVING) {
        const dataURL = cvn.elt.toDataURL('image/png');
        const base64Data = dataURL.split(',')[1];
        zip.file(`${poster.name}.png`, base64Data, { base64: true });
    }

    index++;
    if (index < POSTERS.length) {
        await new Promise((resolve) => setTimeout(() => resolve(), WAIT_TIME));
        createPoster();
    } else if (ENABLE_SAVING) {
        const content = await zip.generateAsync({ type: 'blob' })
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'images.zip';
        link.click();
    }
}

class PosterBuilder {
    constructor(type) {
        this.type = type;
    }

    static init(type = "default") {
        return new PosterBuilder(type);
    }

    async url(imagepath) {
        push();
        noStroke();
        translate(width / 2, height / 2);
        imageMode(CENTER);
        const img =
            await new Promise((resolve) => loadImage(imagepath, (img) => resolve(img), console.error));
        image(img, 0, 0);
        pop();
        return this;
    }

    color(colorargs) {
        noStroke();
        if (typeof colorargs === 'string' || typeof colorargs === 'number')
            fill(color(colorargs));
        else
            fill(color(...colorargs));
        rect(0, 0, width, height);
        return this;
    }

    overlay(gradient = false) {
        if (gradient) {
            fillGradient('radial', {
                from: [width / 2, height / 2, 0], // x, y, radius
                to: [width / 2, height / 2, 900], // x, y, radius
                steps: [color(0, 50), color(0, 125), color(0, 255)]
            });
        } else {
            fill(0, 50);
        }
        noStroke();
        rect(0, 0, width, height);
        return this;
    }

    side() {
        stroke(255);
        strokeWeight(25);
        line(0, 0, width, 0);
        line(width, 0, width, height);
        line(width, height, 0, height);
        line(0, height, 0, 0);
        return this;
    }

    text(lines) {
        noStroke();
        fill(255);
        textAlign(CENTER);
        textFont(font);
        push();
        translate(width / 2, height / 2);
        if (lines.length === 2) {
            textSize(72);
            text(lines[0].toUpperCase(), 0, 72 / 2);
            textSize(40);
            text(lines[1].toUpperCase(), 0, -72 / 2);
        } else if (lines.length === 1) {
            textSize(72);
            text(lines[0].toUpperCase(), 0, 72 / 3);
        }
        pop();
    }
}