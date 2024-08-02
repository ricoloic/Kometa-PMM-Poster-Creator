var font;
var index = 0;
var zip;
var cvn;
var ENABLE_SAVING = false;
var waitTime = 250;
var COLORS = [
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
var posters = [];

function preload() {
    font = loadFont('/FFGoodProCond-Medium.ttf');
}

function setup() {
    zip = new JSZip();
    cvn = createCanvas(600, 900, document.getElementById('poster-canvas'));
    ElementBuiler.collectionList();
    ElementBuiler.tabSelector();
    ElementBuiler.generate();
    ElementBuiler.download();
    ElementBuiler.waitTime();
}

async function createPoster(download = false, filename = "images") {
    const poster = posters[index];

    const builder = PosterBuilder.init(poster.type ?? 'default');
    if (poster.url) {
        await builder.url(poster.url);
    } else if (poster.color) {
        builder.color(poster.color);
        builder.overlay(true);
    } else {
        builder.color(COLORS[Math.floor(Math.random() * COLORS.length)]);
        builder.overlay(true);
    }
    if (poster.overlay) {
        builder.overlay(false);
    }
    if (poster.lines) builder.text(poster.lines);
    builder.side();

    if (download) {
        const dataURL = cvn.elt.toDataURL('image/png');
        const base64Data = dataURL.split(',')[1];
        zip.file(`${poster.name}.png`, base64Data, { base64: true });
    }

    index++;
    if (index < posters.length) {
        await new Promise((resolve) => setTimeout(() => resolve(), waitTime));
        createPoster(download, filename);
    } else if (download) {
        const content = await zip.generateAsync({ type: 'blob' })
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${filename}.zip`;
        link.click();
    }
}

class ElementBuiler {
    static collectionList() {
        const container = document.getElementById('collection-list');
        for (const [library, collections] of Object.entries(POSTERS)) {
            for (const [collection, data] of Object.entries(collections)) {
                const node = document.createElement("button");
                node.className = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-gray-100 hover:text-black h-10 shrink-0 px-6 py-2 rounded-full data-[state=active]:bg-black data-[state=active]:text-white";
                node.textContent = `${library} ${collection}`;
                node.setAttribute('data-state', 'inactive');
                node.onclick = () => {
                    index = 0;
                    posters = data;
                    document
                        .querySelector('#collection-list button[data-state="active"]')
                        ?.setAttribute('data-state', 'inactive');
                    node.setAttribute('data-state', 'active');

                    const list = document.querySelector('#items-list');
                    list.innerHTML = data.map((elem) => `
                    <div class="grid gap-1 border-gray-200 border-2 border-solid rounded-md px-4 py-2 w-full hover:bg-gray-100">
                        <h3 class="font-medium">${elem.lines[0]}</h3>
                        <p class="text-sm text-muted-foreground">${elem.type}</p>
                    </div>
                    `).join("");
                };
                container.appendChild(node);
            }
        }

    }

    static tabSelector() {
        const tabItems = document.querySelector('#tab-items');
        const items = document.querySelector('#items');
        const tabOptions = document.querySelector('#tab-options');
        const options = document.querySelector('#options');
        tabItems.onclick = () => {
            options.setAttribute('data-state', 'inactive');
            tabOptions.setAttribute('data-state', 'inactive');
            items.setAttribute('data-state', 'active');
            tabItems.setAttribute('data-state', 'active');
        };
        tabOptions.onclick = () => {
            items.setAttribute('data-state', 'inactive');
            tabItems.setAttribute('data-state', 'inactive');
            options.setAttribute('data-state', 'active');
            tabOptions.setAttribute('data-state', 'active');
        };
    }

    static generate() {
        const button = document.querySelector('#generate');
        button.onclick = () => {
            index = 0;
            createPoster(false);
        };
    }

    static download() {
        const button = document.querySelector('#download');
        button.onclick = () => {
            index = 0;
            createPoster(true, document.querySelector('#collection-list button[data-state="active"]')?.textContent ?? 'images');
        };
    }

    static waitTime() {
        const input = document.querySelector('#wait-time');
        input.onchange = (event) => {
            waitTime = parseInt(event.target.value, 10) || 0;
            console.log(waitTime);
        };
    }
}