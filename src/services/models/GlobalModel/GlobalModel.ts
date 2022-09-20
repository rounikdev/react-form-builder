import { Pattern } from '@core';

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
      const startTime = performance.now();

      const wait: FrameRequestCallback = (timestamp) => {
        const elapsedTime = timestamp - startTime;

        /* istanbul ignore next */
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

  static hasValue = (value: unknown) => value !== undefined && value !== null && value !== '';

  static isNotEmptyArray = <T>(value: T): boolean => !!(Array.isArray(value) && value.length);

  static isString = <T>(value: T): boolean => typeof value === 'string' || value instanceof String;

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

      /* istanbul ignore next */
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

  static valueSplitter = ({
    goForward,
    pattern,
    patternDelimiter,
    value
  }: {
    goForward: boolean;
    pattern: Pattern;
    patternDelimiter: string;
    value: string;
  }) => {
    const patterSplitted = pattern.split(patternDelimiter);

    let valueFormatted = value.split(patternDelimiter).join('').replace(/\s/g, '');
    let indexCounter = 0;

    const output = patterSplitted.reduce((accum, patternString, index) => {
      let innerAccumulation = '';

      innerAccumulation = Array.from(patternString).reduce((innerAccum) => {
        if (valueFormatted.length > 0) {
          if (indexCounter < index) {
            indexCounter++;
          }

          innerAccum += valueFormatted[0];
          valueFormatted = valueFormatted.substring(1);
        } else {
          innerAccum += '';
        }

        return innerAccum;
      }, '');

      if (
        accum.length > 0 &&
        (innerAccumulation !== '' ||
          (goForward &&
            accum.length ===
              patternString.length * (indexCounter + 1) + patternDelimiter.length * indexCounter))
      ) {
        accum += `${patternDelimiter}${innerAccumulation}`;
      } else {
        accum += innerAccumulation;
      }

      return accum;
    }, '');

    return output;
  };

  static removeNonDigitFromNegativeString = (rawValue: string): string =>
    rawValue.replace(/[^\d|-]/g, '').replace(/(?!^)-/g, '');

  static removeNonDigitFromString = (rawValue: string): string => rawValue.replace(/\D/g, '');

  static classer = (list: (boolean | undefined | string)[]) => list.filter(Boolean).join(' ');

  static executeOnNextPaint = (callback: () => void | (() => Promise<void>)) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  };

  // TODO: Think of using a package to check equality of reference types:
  static createStableDependency = (dependency: unknown) =>
    typeof dependency === 'bigint' ? dependency : JSON.stringify(dependency);
}
