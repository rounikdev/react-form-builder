import { RAFIdInfo } from './types';

export class GlobalModel {
  static deepClone = (object: unknown) => JSON.parse(JSON.stringify(object));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getNestedValue = (item: any, path: (string | number)[]): any => {
    if (path.length === 0 || !item) {
      return item;
    } else {
      const [currentProp, ...rest] = path;

      return GlobalModel.getNestedValue(item[currentProp], rest);
    }
  };

  static clearRAFTimeout = (rafIdInfo: RAFIdInfo) => {
    if (rafIdInfo && rafIdInfo.id) {
      cancelAnimationFrame(rafIdInfo.id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static debounceRAF = (fn: (...params: any[]) => void, time: number) => {
    const rafIdInfo: RAFIdInfo = {
      id: null
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...params: any[]) => {
      if (typeof fn !== 'function' || typeof time !== 'number') {
        return;
      }

      const startTime = performance.now();

      const wait: FrameRequestCallback = (timestamp) => {
        const elapsedTime = timestamp - startTime;

        if (elapsedTime < time) {
          GlobalModel.clearRAFTimeout(rafIdInfo);
          rafIdInfo.id = requestAnimationFrame(wait);
        } else {
          GlobalModel.clearRAFTimeout(rafIdInfo);
          fn(...params);
        }
      };

      GlobalModel.clearRAFTimeout(rafIdInfo);
      rafIdInfo.id = requestAnimationFrame(wait);
    };
  };

  static setRAFTimeout = (callback: () => void, timeout: number) => {
    const rafIdInfo: RAFIdInfo = {
      id: null
    };

    if (typeof callback !== 'function' || typeof timeout !== 'number') {
      return rafIdInfo;
    }

    const startTime = performance.now();

    const wait: FrameRequestCallback = (timestamp) => {
      const elapsedTime = timestamp - startTime;

      if (elapsedTime < timeout) {
        GlobalModel.clearRAFTimeout(rafIdInfo);
        rafIdInfo.id = requestAnimationFrame(wait);
      } else {
        GlobalModel.clearRAFTimeout(rafIdInfo);
        callback();
      }
    };

    rafIdInfo.id = requestAnimationFrame(wait);

    return rafIdInfo;
  };
}
