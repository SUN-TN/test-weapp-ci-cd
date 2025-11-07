// 缓存请求的接口信息
const requestMap: string[] = []
const methodMap = {
  GET: 'get',
  DELETE: 'delete',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  get: 'get',
  delete: 'delete',
  post: 'post',
  put: 'put',
  patch: 'patch'
}
/**
 * 检查是不是重复请求
 * @param {Object} config
 */
const checkRepeatRequest = config => {
  const requestInfo = getRequestInfo(config)
  return requestMap.includes(requestInfo)
}

/**
 * 添加请求
 * @param {Object} config
 */
const addRequest = config => {
  // 获取当前请求信息
  if (!config?.openPreventRequest) return
  const requestInfo = getRequestInfo(config)
  requestMap.push(requestInfo)
}
/**
 * 移除请求
 * @param {Object} config
 */
const removeRequest = config => {
  if (!config?.openPreventRequest) return
  const requestInfo = getRequestInfo(config)
  const requestIndex = requestMap.indexOf(requestInfo)
  if (requestIndex > -1) {
    requestMap.splice(requestIndex, 1)
  }
}

/**
 * 获取请求信息
 * @param {Object} config
 */

function getRequestInfo(config) {
  // 重复请求定义为： 相同method，url，data
  const { method, url, data, simpleCheck } = config
  let dataString = data
  if (typeof data !== 'string') {
    dataString = JSON.stringify(data)
  }
  if (simpleCheck) {
    // 弱校验
    return [methodMap[method], url].join('&')
  } else {
    // 强校验
    return [methodMap[method], url, dataString].join('&')
  }
}

export default {
  checkRepeatRequest,
  addRequest,
  removeRequest
}
