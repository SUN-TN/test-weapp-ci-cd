import BaseStore from '@/stores/Base';

export default class UserStore extends BaseStore {
  // type = '';
  type = 'admin'; // @TODO: 测试
  // name = '';
  name = 'Administrator'; // @TODO: 测试

  constructor() {
    super();

    this._init();
  }

  /**
   * 自定义 action
   */
  yourAnotherMethod() {
    console.log('your another method');
  }

  setName(name: string) {
    this.name = name;
  }
}
