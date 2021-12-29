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
}
