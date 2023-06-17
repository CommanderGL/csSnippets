export interface UpdateOptions {
    html?: string,
    text?: any,
    props?: {
        [props: string]: any
    },
    children?: Element[] | Scar[],
    parent?: Element | Scar,
    classes?: string[]
}

export interface OverrideOptions {
    text: () => void,
    html: () => void,
    children: () => void,
    props: () => void,
    classes: () => void
}

export interface ScarOptions extends UpdateOptions {
    type: keyof HTMLElementTagNameMap | ((options: UpdateOptions, override: OverrideOptions) => Element | Scar)
}

type StateOptions = ((() => any) | ((nv: any) => any))[];

/* export const useState = (fv: any): StateOptions => {
    let v = fv;

    const state = () => v;

    const setState = (nv: any) => v = nv;

    return [
        state,
        setState
    ];
}

let effects: {
    [effect: string]: any
} = {};

export const useEffect = (cb: (...args: any[]) => any, deps: any[]) => {
    const noDeps = !deps;
    const effectDeps = effects[cb.toString()];
    const depsChanged = effectDeps ? !deps.every((el, i) => el === effectDeps[i]) : true;
    if (noDeps || depsChanged) {
        cb();
        effects[cb.toString()] = deps;
    }
} */

const scars: Scar[] = [];

export default class Scar {
    elem: Element = document.createElement("div");
    parent?: Element | Scar;
    #overrides: string[] = [];
    #Comp?: (props: UpdateOptions, override: OverrideOptions) => Element | Scar;
    Comp?: Element | Scar;
    children: Scar[] = [];
    options: ScarOptions;

    constructor(options: ScarOptions) {
        this.options = options;
        if (typeof options.type === "function") {
            this.#Comp = options.type;
        } else {
            this.elem = document.createElement(options.type);
        }
        if (options.parent != null) this.parent = options.parent;

        this.update(options);
        this.parent instanceof Element ? this.parent.appendChild(this.elem) : this.parent?.elem.appendChild(this.elem);
        scars.push(this);
    }

    static fromElem(elem: Element) {;
        const props: {
            [prop: string]: any
        } = {};
        [...elem.attributes].forEach(attr => {
            props[attr.name] = attr.value;
        });

        return new Scar({
            type: <keyof HTMLElementTagNameMap>elem.tagName,
            html: elem.innerHTML,
            props
        });
    }

    updateComp(options: UpdateOptions) {
        this.elem.remove();

        const overrideText = () => this.#overrides.push("text");
        const overrideHtml = () => this.#overrides.push("html");
        const overrideChildren = () => this.#overrides.push("children");
        const overrideProps = () => this.#overrides.push("props");
        const overrideClasses = () => this.#overrides.push("classes");

        const override: OverrideOptions = {
            text: overrideText,
            html: overrideHtml,
            children: overrideChildren,
            props: overrideProps,
            classes: overrideClasses
        };

        this.Comp = (<((props: UpdateOptions, override: OverrideOptions) => Element | Scar)>this.#Comp)(options, override);
        if (this.Comp instanceof Element) {
            this.elem = this.Comp;
            return;
        }
        this.elem = this.Comp.elem;
        if (this.parent instanceof Element) {
            this.parent.appendChild(this.elem);
        } else {
            this.parent?.elem.appendChild(this.elem);
        }
        this.children = this.Comp.children;
    }

    update(options: UpdateOptions) {
        if (this.#Comp != null) this.updateComp(options);

        if (options.props != null && !this.#overrides?.includes("props")) Object.entries(options.props).forEach(([prop, value]) => {
            this.elem.setAttribute(prop, value);
        });

        if (options.children != null) options.children.forEach(child => {
            if (!this.#overrides?.includes("children")) {
                if (child instanceof Element) {
                    this.elem.appendChild(child);
                    return;
                }
    
                this.elem.appendChild(child.elem);
                child.parent = this;
            }
            if (child instanceof Element) return;
            this.children.push(child);
        });

        if (options.html != null && !this.#overrides?.includes("html")) this.elem.innerHTML = options.html;
        if (options.text != null && !this.#overrides?.includes("text")) this.elem.textContent = options.text;

        if (options.classes != null && !this.#overrides?.includes("classes")) options.classes.forEach(cl => {
            this.elem.classList.add(cl);
        }); 

        /* if (options.children != null) options.children.forEach(child => {
            if (child instanceof Scar) child.render(child);
        }); */
    }

    registerEventListener(e: keyof HTMLElementEventMap, cb: (ev: Event) => any) {
        this.elem.addEventListener(e, ev => {
            cb(ev);
            // this.update(this.#options);
            scars.forEach(scar => {
                scar.update(scar.options);
            });
        });
        return this;
    }

    set html(v: string | null) {
        if (v == null) {
            this.update({
                html: ''
            });
            return;
        }
        this.update({
            html: v
        });
    }

    get html() {
        return this.elem.innerHTML;
    }

    set text(v: any | null) {
        if (v == null) {
            this.update({
                text: ''
            });
            return;
        }
        this.update({
            text: v
        });
    }

    get text() {
        return this.elem.textContent;
    }

    getChild(q: keyof HTMLElementTagNameMap | string): Scar | null {
        let ret: Scar| null = null;
        const elem = this.elem.querySelector(q);
        this.children?.forEach(child => {
            if (elem == child.elem) ret = child;
        });

        return ret;
    }
}