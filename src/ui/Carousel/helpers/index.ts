// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultExtractId = (item: any) => item?.id;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultExtractLabel = (item: any) => item?.label;

export const defaultRenderFrame = () => null;

export const getNextIndex = (current: number, last: number, toLeft?: boolean): number => {
  let next = null;

  switch (current) {
    case 0:
      next = toLeft ? Math.min(current + 1, last) : last;
      break;

    case last:
      next = toLeft ? 0 : Math.max(current - 1, 0);
      break;

    default:
      next = toLeft ? current + 1 : current - 1;
      break;
  }

  return next;
};
