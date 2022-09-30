(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ConditionalLogic = factory());
})(this, (function () { 'use strict';

    const getDom = selector => {
        switch (selector) {
            case 'string':
                return document.querySelector(selector);
            default:
                return selector;
        }
    };
    const createDom = (dom, className) => {
        const $result = document.createElement(dom);
        className && $result.classList.add(className);
        return $result;
    };

    class Selector {
        $el;
        $label;
        label;
        value;
        selectorUl;
        constructor(label, value, selectorList) {
            this.label = label;
            this.value = value;
            this.selectorUl = selectorList;
            this.init();
            this.initEvent();
        }
        init() {
            this.$el = createDom('div', 'condition-selector-box');
            this.$el.innerText = this.label;
            // this.$label = document.createElement('');
            // this.$label.innerText = this.label;
            // this.$el.appendChild(this.$label);
        }
        initEvent() {
            this.$el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const $ul = e.target;
                this.showUl($ul);
            });
        }
        showUl($ul) {
            const rect = $ul.getClientRects()[0];
            this.selectorUl.trigger(rect, this);
        }
        setValue({ label, value }) {
            if (this.value === value)
                return;
            this.value = value;
            this.label = label;
            this.$el.innerText = label;
        }
    }
    class SelectorList {
        options;
        $el;
        isShow;
        currentSelector;
        constructor(config) {
            this.isShow = false;
            this.options = config;
            this.init();
        }
        init() {
            const $ul = createDom('ul', 'selector-list');
            $ul.style.position = 'absolute';
            this.$el = $ul;
            this.initLi();
            this.initEvent();
        }
        initLi() {
            this.options.forEach((option) => {
                const $li = document.createElement('li');
                $li.setAttribute('data-value', option.value.toString());
                $li.innerText = option.label;
                this.$el.appendChild($li);
            });
        }
        initEvent() {
            this.$el.addEventListener('click', (e) => this.liClickHandeler(e));
        }
        liClickHandeler(e) {
            const $li = e.target;
            const value = Number($li.getAttribute('data-value'));
            const option = this.options.find((item) => item.value === value);
            this.currentSelector.setValue(option);
            this.hide();
        }
        trigger(rect, selector) {
            if (this.currentSelector === selector) {
                this.isShow ? this.hide() : this.show(rect);
            }
            else {
                this.currentSelector = selector;
                this.show(rect);
            }
        }
        hide() {
            this.currentSelector = null;
            this.$el.remove();
            this.isShow = false;
            globalEventHelper.remove('click');
        }
        show(rect) {
            const { left, top, width, height } = rect;
            this.$el.style.width = width + 'px';
            this.$el.style.left = left + 'px';
            this.$el.style.top = top + height + 'px';
            if (!this.isShow) {
                document.body.appendChild(this.$el);
                this.listenGlobalClick();
                this.isShow = true;
            }
        }
        listenGlobalClick() {
            globalEventHelper.listen('click', this.hide.bind(this));
        }
    }
    const globalEventHelper = {
        callback: null,
        listen: function (event, callback) {
            if (this.callback)
                return;
            document.addEventListener(event, callback);
            this.callback = callback;
        },
        remove: function (event) {
            if (!this.callback)
                return;
            document.removeEventListener(event, this.callback);
            this.callback = null;
        },
    };

    class ConditionalList {
        id;
        group;
        label;
        $el;
        $input;
        constructor(list, group) {
            this.id = list.id;
            this.label = list.label;
            this.group = group;
            this.init();
        }
        init() {
            const $list = createDom('div', 'list-row');
            this.$el = $list;
            const $label = createDom('div', 'list-row-label');
            this.initInput($label);
            $list.appendChild($label);
            const $del = createDom('div', 'list-row-icon');
            $del.innerText = 'delete';
            $del.addEventListener('click', () => this.group.deleteRow(this));
            // this.initDelBtn($del);
            $list.appendChild($del);
        }
        initInput($container) {
            const $input = createDom('input');
            $input.setAttribute('value', this.label);
            $input.setAttribute('readonly', 'true');
            this.$input = $input;
            $container.appendChild($input);
        }
        inputClickHandler() {
            this.$input.removeAttribute('readonly');
        }
        inputBlur() {
            const value = this.$input.value;
            this.label = value;
            this.$input.setAttribute('readonly', 'true');
        }
    }

    // type GroupListOption= extend {
    // }
    class ConditionalGroup {
        $el;
        $listWrap;
        id;
        label;
        rowList;
        selectorOptions;
        selectList;
        selector;
        global;
        constructor(option, global) {
            const $container = global.$groupListContent;
            const selectorOptions = global.selectorOptions;
            const selectList = global.selectList;
            this.global = global;
            this.id = option.id;
            this.label = option.label;
            this.selectorOptions = selectorOptions;
            this.selectList = selectList;
            this.rowList = [];
            this.init(option.list);
            this.initEvent();
            this.mount($container);
        }
        init(list) {
            const $el = createDom('div', 'conditional-group');
            this.$el = $el;
            this.initHeader($el);
            this.initList($el, list);
            this.initOperation($el);
        }
        initHeader($container) {
            const $header = createDom('div', 'conditional-group-title');
            const $text = createDom('div');
            $text.style.flex = '1';
            // $text.innerText = `${this.label}`;
            $text.innerText = ` `;
            $header.appendChild($text);
            const $del = createDom('div', 'remove-btn');
            $del.innerHTML = 'del';
            $del.addEventListener('click', () => this.global.removeGroup(this));
            $header.appendChild($del);
            $container.appendChild($header);
        }
        initList($container, list) {
            const $listContainer = createDom('div', 'conditional-group-content');
            const $condition = createDom('div', 'list-condition');
            this.initSelector($condition);
            $listContainer.appendChild($condition);
            const $listWrap = createDom('div', 'list-wrap');
            this.$listWrap = $listWrap;
            $listContainer.appendChild($listWrap);
            list.forEach((li) => {
                const liIns = new ConditionalList(li, this);
                this.rowList.push(liIns);
                $listWrap.appendChild(liIns.$el);
            });
            $container.appendChild($listContainer);
        }
        initSelector($container) {
            const { label, value } = this.selectorOptions[0];
            const $line = createDom('div', 'line-box');
            this.selector = new Selector(label, value, this.selectList);
            $container.appendChild($line);
            $container.appendChild(this.selector.$el);
        }
        initOperation($el) {
            const $operation = createDom('div', 'conditional-group-operation');
            const $btn = createDom('div');
            $btn.innerText = 'add a new word';
            $operation.appendChild($btn);
            $operation.addEventListener('click', this.addNewRow.bind(this));
            $el.appendChild($operation);
        }
        initEvent() {
            this.$el.addEventListener('click', (e) => {
                const $target = e.target;
                if ($target instanceof Element) {
                    const tagName = $target.tagName;
                    if (tagName === 'INPUT') {
                        e.stopPropagation();
                        e.preventDefault();
                        const r = this.rowList.find((row) => row.$input === $target);
                        if (r) {
                            r.inputClickHandler();
                        }
                    }
                }
            });
            this.$el.addEventListener('focusout', (e) => {
                const $target = e.target;
                if ($target instanceof Element) {
                    const tagName = $target.tagName;
                    if (tagName === 'INPUT') {
                        e.stopPropagation();
                        e.preventDefault();
                        const r = this.rowList.find((row) => row.$input === $target);
                        if (r) {
                            r.inputBlur();
                        }
                    }
                }
            });
        }
        mount($container) {
            $container.appendChild(this.$el);
        }
        addNewRow() {
            const newRow = {
                id: Date.now(),
                label: '',
            };
            const liIns = new ConditionalList(newRow, this);
            this.rowList.push(liIns);
            this.$listWrap.appendChild(liIns.$el);
        }
        deleteRow(row) {
            if (this.rowList.length < 3)
                return;
            this.rowList = this.rowList.filter((item) => item !== row);
            row.$el.remove();
        }
    }

    const CLASS_NAME = 'conditional-selector';
    const DEFAULT_OPTION = {
        list: [
            {
                id: 1111,
                label: '',
                list: [
                    {
                        id: 1111,
                        label: '',
                    },
                    {
                        id: 222,
                        label: '',
                    },
                ],
                conditionValue: 1,
            },
            {
                id: 2222,
                label: '',
                list: [
                    {
                        id: 1111,
                        label: '',
                    },
                    {
                        id: 222,
                        label: '',
                    },
                ],
                conditionValue: 1,
            },
        ],
        selectorOption: [
            {
                label: 'and',
                value: 0,
            },
            {
                label: 'or',
                value: 1,
            },
        ],
    };
    class ConditionalSelector {
        $container;
        $groupListContent;
        selectorOptions;
        globalSelector;
        selectList;
        groupList;
        constructor(seletor, option) {
            const { selectorOption, list } = option || {};
            const $seletor = getDom(seletor);
            this.selectorOptions = selectorOption || DEFAULT_OPTION.selectorOption;
            const listData = list || DEFAULT_OPTION.list;
            this.groupList = [];
            this.selectList = new SelectorList(this.selectorOptions);
            this.init(listData);
            this.mount($seletor);
        }
        init(list) {
            this.$container = document.createElement('div');
            this.$container.classList.add(CLASS_NAME);
            const $groupWarp = document.createElement('div');
            $groupWarp.classList.add('conditional-group-content');
            this.initGlobalSelector($groupWarp);
            this.initGroupList($groupWarp, list);
            this.$container.appendChild($groupWarp);
            this.initAddBtn();
        }
        initGlobalSelector($groupWarp) {
            const $conditionWrap = createDom('div', 'group-condition');
            const $line = createDom('div', 'line-box');
            const { label, value } = this.selectorOptions[0];
            this.globalSelector = new Selector(label, value, this.selectList);
            $conditionWrap.appendChild($line);
            $conditionWrap.appendChild(this.globalSelector.$el);
            $groupWarp.appendChild($conditionWrap);
        }
        initGroupList($groupWarp, list) {
            const $groupListContent = document.createElement('div');
            this.$groupListContent = $groupListContent;
            $groupListContent.classList.add('group-list-content');
            list.forEach((group) => {
                const groupList = new ConditionalGroup(group, this);
                this.groupList.push(groupList);
            });
            $groupWarp.appendChild($groupListContent);
        }
        initAddBtn() {
            const $btn = document.createElement('div');
            $btn.classList.add('new-group-btn');
            const $span = document.createElement('span');
            $span.innerText = 'new group';
            $btn.appendChild($span);
            $btn.addEventListener('click', () => this.addGroup());
            this.$container.appendChild($btn);
        }
        mount($wrap) {
            $wrap.appendChild(this.$container);
        }
        getData() {
            const result = {
                conditionValue: this.globalSelector.value,
                groupList: [],
            };
            this.groupList.forEach((group) => {
                const obj = {
                    conditionValue: group.selector.value,
                    list: group.rowList.map((row) => {
                        return {
                            label: row.label,
                            id: row.id,
                        };
                    }),
                };
                result.groupList.push(obj);
            });
            return result;
        }
        addGroup() {
            const group = {
                id: Date.now(),
                label: '',
                list: [
                    {
                        id: Date.now(),
                        label: '',
                    },
                ],
                conditionValue: 0,
            };
            const groupList = new ConditionalGroup(group, this);
            this.groupList.push(groupList);
        }
        removeGroup(group) {
            if (this.groupList.length < 3)
                return;
            this.groupList = this.groupList.filter((item) => item !== group);
            group.$el.remove();
        }
    }

    return ConditionalSelector;

}));
//# sourceMappingURL=index.js.map
