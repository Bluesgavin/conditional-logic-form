export const getDom = selector => {
    switch (selector) {
        case 'string':
            return document.querySelector(selector);
        default:
            return selector;
    }
};

export const createDom = (dom: string, className?: string): HTMLElement => {
    const $result = document.createElement(dom);
    className && $result.classList.add(className);
    return $result;
};
