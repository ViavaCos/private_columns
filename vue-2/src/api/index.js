import { ELEMENT_PRIVATE_COLUMNS } from '@/constant/storageKeys'

/**
 * 获取私有列配置
 */
export const fetchPrivateColumns = () => {
  return new Promise((resolve) => {
    // 模拟接口请求
    setTimeout(() => {
      const remoteConfig = JSON.parse(localStorage.getItem(ELEMENT_PRIVATE_COLUMNS) || '[]')
      if (!remoteConfig.length) {
        resolve([])
        return
      }

      resolve(remoteConfig)
    }, 500);
  })
}

/**
 * 更新私有化配置
 */
export const updatePrivateColumns = (columns) => {
  return new Promise((resolve) => {
    localStorage.setItem(ELEMENT_PRIVATE_COLUMNS, JSON.stringify(columns))
    setTimeout(() => {
      resolve()
    }, 20);
  })
}
