import { shallow } from 'enzyme';

import { BaseCSS } from '../BaseCSS';

describe('BaseCSS', () => {
  it('Mounts without errors', () => {
    const wrapper = shallow(<BaseCSS />);

    expect(wrapper.find(BaseCSS)).toBeDefined();
  });

  it('Has displayName', () => {
    expect(BaseCSS.displayName).toBe('BaseCSS');
  });
});
