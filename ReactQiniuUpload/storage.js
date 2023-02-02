/**
 * 获取值
 * @param {string} key
 * @returns
 */
export function getStorage(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key));
  } catch (e) {
    return sessionStorage.getItem(key);
  }
}

/**
 * 保存值
 * @param {string} key
 * @param {*} value
 */
export function setStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    sessionStorage.setItem(key, value);
  }
}
