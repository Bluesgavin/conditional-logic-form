import { getDom, createDom } from './utils';
import Selector from './Selector';
import './styles/index.ts';
import { SelectorList, SelectorListInfo } from './Selector';
import ConditionalGroup from './ConditionalGroup';
import { GroupList } from './ConditionalGroup';

const CLASS_NAME = 'conditional-selector';

type Option = {
  list: GroupList[];
  selectorOption: SelectorListInfo;
};
const DEFAULT_OPTION: Option = {
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
  $container: HTMLElement;
  $groupListContent: HTMLElement;
  selectorOptions: SelectorListInfo;
  globalSelector: Selector;
  selectList: SelectorList;
  groupList: ConditionalGroup[];
  constructor(seletor, option?: Option) {
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

  removeGroup(group: ConditionalGroup) {
    if (this.groupList.length < 3) return;
    this.groupList = this.groupList.filter((item) => item !== group);
    group.$el.remove();
  }
}

export default ConditionalSelector;

