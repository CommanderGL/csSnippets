import Scar, { OverrideOptions, UpdateOptions } from '../../index';

const root = document.body;

let count = 0;

const App = (_options: UpdateOptions, override: OverrideOptions) => {
    override.children();
    override.classes();

    const countElem = new Scar({
        type: "h1",
        text: count,
        classes: ['count']
    });

    const incElem = new Scar({
        type: "button",
        text: "Increment",
        classes: ['inc']
    });

    if (incElem != null) incElem.registerEventListener("click", () => {
        count++;
    });

    return new Scar({
        type: "div",
        children: [
            countElem,
            incElem
        ],
        classes: ['App']
    });
}

new Scar({
    type: App,
    parent: root
});