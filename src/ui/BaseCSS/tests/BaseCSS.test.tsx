import { testRender } from '@services/utils';

import { BaseCSS } from '../BaseCSS';

describe('BaseCSS', () => {
  it('Has displayName', () => {
    expect(BaseCSS.displayName).toBe('BaseCSS');
  });

  it('Has Container class', () => {
    const { getByDataTest } = testRender(<BaseCSS />);

    const element = getByDataTest('base-css');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('Container');
  });
});
