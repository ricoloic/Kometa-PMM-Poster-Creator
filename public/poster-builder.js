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