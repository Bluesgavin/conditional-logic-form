import { createDom } from './utils';
import { SelectorList, SelectorListInfo } from './Selector';
import Selector from './Selector';
import ConditionalList from './ConditionalList';
import ConditionalSelector from './index';

type ItemInfo = {
  label: string;
  id: number;
};

export type GroupList = {
  id: number;
  label: string;
  list: ItemInfo[];
  conditionValue: number;
};

// type GroupListOption= extend {

// }

class ConditionalGroup {
  $el: HTMLElement;
  $listWrap: HTMLElement;
  id: number;
  label: string;
  rowList: ConditionalList[];
  selectorOptions: SelectorListInfo;
  selectList: SelectorList;
  selector: Selector;
  global: ConditionalSelector;
  constructor(option: GroupList, global: ConditionalSelector) {
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
  init(list: ItemInfo[]) {
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

  initList($container, list: ItemInfo[]) {
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
    const newRow: ItemInfo = {
      id: Date.now(),
      label: '',
    };
    const liIns = new ConditionalList(newRow, this);
    this.rowList.push(liIns);
    this.$listWrap.appendChild(liIns.$el);
  }

  deleteRow(row: ConditionalList) {
    if (this.rowList.length < 3) return;
    this.rowList = this.rowList.filter((item) => item !== row);
    row.$el.remove();
  }
}

export default ConditionalGroup;

