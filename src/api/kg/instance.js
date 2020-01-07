import { createAPI } from '../util';
import config from '../config';

const baseUrl = {
  mock: 'http://h2.beyondcloud.cn/mock/5c53e89f86811c03b07e4be8/OWL_Editing',
  dev: 'http://192.168.1.196:8088',
  pre: 'http://192.168.1.55:8088',
  prod: ''
}[config.env || 'mock'];

export default createAPI(baseUrl);
