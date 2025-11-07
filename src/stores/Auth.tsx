import BaseStore from '@/stores/Base';

export default class AuthStore extends BaseStore {
  token_type = 'Bearer';
  // token = '';
  token = 'TEST'; // @TODO: 临时测试
  // expired_at = '';
  expired_at = new Date('2099-01-01').toISOString(); // @TODO: 临时测试

  constructor() {
    super();

    this._init();
  }

  update<K extends keyof this>(props: Partial<Record<K, this[K]>>) {
    super.update(props);

    // 如果存在 token 更新的情况下单独存入 localStorage, 为了便于封装的 API 类取用
    if ('token' in props && props.token) {
      localStorage.setItem('token', props.token as string);
    }
  }
}
