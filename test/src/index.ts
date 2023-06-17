import Scar, { OverrideOptions, UpdateOptions } from '../../index';

const root = <HTMLDivElement>document.querySelector('#app');

let count = 0;

const App = (_options: UpdateOptions, override: OverrideOptions) => {
    override.children();
    override.classes();

    /* const loop = () => {
        useEffect(() => {
            const countElem = app.getChild('.count');
            if (countElem != null) countElem.text = count;
        }, [count]);
    
        window.requestAnimationFrame(loop);
    }
    
    window.requestAnimationFrame(loop); */

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

new Scar({
    type: App,
    parent: root
});