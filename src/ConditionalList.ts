import { createDom } from './utils';
import ConditionalGroup from './ConditionalGroup';

type ListInfo = {
  id: number;
  label: string;
};

class ConditionalList {
  id: number;
  group: ConditionalGroup;
  label: string;
  $el: HTMLElement;
  $input: HTMLInputElement;
  constructor(list: ListInfo, group) {
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
    const $input = createDom('input') as HTMLInputElement;
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

export default ConditionalList;

