/**
 * 防抖函数
 * @param {Function} func - 要进行防抖处理的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 返回一个新的函数，该函数在指定的时间间隔内最多只会执行一次
 */
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timerId: number | undefined;

  // 返回一个新的函数
  return (...args: Parameters<T>) => {
    // 清除上一个定时器
    clearTimeout(timerId);

    // 设置新的定时器，在指定的延迟时间后执行函数
    timerId = window.setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default debounce; 