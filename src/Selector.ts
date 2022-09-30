import { createDom } from './utils';

class Selector {
  $el: HTMLElement;
  $label: HTMLElement;
  label: string;
  value: number;
  selectorUl: SelectorList;
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
    if (this.value === value) return;
    this.value = value;
    this.label = label;
    this.$el.innerText = label;
  }
}

export type SelectorListInfo = {
  label: string;
  value: number;
}[];
export class SelectorList {
  options: SelectorListInfo;
  $el: HTMLElement;
  isShow: boolean;
  currentSelector: Selector;
  constructor(config: SelectorListInfo) {
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
    } else {
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
  show(rect: DOMRect) {
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
    if (this.callback) return;
    document.addEventListener(event, callback);
    this.callback = callback;
  },
  remove: function (event) {
    if (!this.callback) return;
    document.removeEventListener(event, this.callback);
    this.callback = null;
  },
};

export default Selector;

