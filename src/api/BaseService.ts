import BaseRequest from './BaseRequest';

export default class BaseService {
  request: BaseRequest;
  constructor(instance: BaseRequest = new BaseRequest()) {
    this.request = instance;
  }
}
