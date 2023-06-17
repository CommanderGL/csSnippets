import Scar, { OverrideOptions, UpdateOptions, useEffect } from '../../index';

const root = <HTMLDivElement>document.querySelector('#app');

let count = 0;

const App = (_options: UpdateOptions, override: OverrideOptions) => {
    override.children();
    override.classes();

    return new Scar({
        type: "div",
        children: [
            new Scar({
                type: "h1",
                text: count,
                classes: ['count']
            }),
            new Scar({
                type: "button",
                text: "Increment",
                classes: ['inc']
            })
        ]
    });
}

/* const countScar = new Scar({
    type: "h1",
    parent: root,
    text: count
});

let btn: Scar | null = new Scar({
    type: "button",
    parent: root,
    text: "Increment"
}); */

const app = new Scar({
    type: App,
    parent: root
});

const incElem = app.getChild('.inc');

if (incElem != null) incElem.registerEventListener("click", () => {
    count++;
});

const loop = () => {
    useEffect(() => {
        const countElem = app.getChild('.count');
        if (countElem != null) countElem.text = count;
    }, [count]);

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);