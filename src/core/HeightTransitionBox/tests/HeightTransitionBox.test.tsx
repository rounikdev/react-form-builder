import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FC, ReactNode, useState } from 'react';

import { testRender } from '@services/utils';

import { HeightTransitionBox } from '../HeightTransitionBox';
import { HeightTransitionProvider } from '../HeightTransitionProvider';
import { HeightTransitionBoxProps } from '../types';

const TestCmp: FC<
  HeightTransitionBoxProps & {
    children?: ReactNode;
    displayContent?: boolean;
  }
> = ({
  children,
  displayContent,
  memoizeChildren,
  onTransitionEnd,
  transitionDuration,
  transitionType
}) => {
  const [showContent, setShowContent] = useState(displayContent ?? false);

  return (
    <>
      <button
        data-test="toggle-content"
        onClick={() => setShowContent((prevState) => !prevState)}
        type="button"
      >
        Toggle
      </button>

      <HeightTransitionBox
        dataTest="test"
        memoizeChildren={memoizeChildren}
        onTransitionEnd={onTransitionEnd}
        transitionDuration={transitionDuration}
        transitionType={transitionType}
      >
        {showContent ? (
          <>
            <div data-test="test-content" />
            {children}
          </>
        ) : null}
      </HeightTransitionBox>
    </>
  );
};

describe('HeightTransitionBox', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let transitionEndEvent: any;
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight'
  );

  beforeEach(() => {
    transitionEndEvent = new Event('transitionend', { bubbles: true, cancelable: false });
    transitionEndEvent.propertyName = 'height';
  });

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 500
    });
  });

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetHeight',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      originalOffsetHeight as PropertyDescriptor & ThisType<any>
    );
  });

  it('Changes `overflow` based on transitioning state', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 0
    });

    const { findByDataTest, getByDataTest } = testRender(<TestCmp />);

    const wrapper = await findByDataTest('test-heightTransition-container');

    expect(window.getComputedStyle(wrapper).overflow).toBe('auto');

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 500
    });

    await userEvent.click(getByDataTest('toggle-content'));

    expect(window.getComputedStyle(wrapper).overflow).toBe('hidden');
  });

  it('Changes `overflow` based on transitioning state with `memoizeChildren` flag', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 0
    });

    const { findByDataTest, getByDataTest } = testRender(<TestCmp memoizeChildren />);

    expect(
      window.getComputedStyle(await findByDataTest('test-heightTransition-container')).overflow
    ).toBe('auto');

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 500
    });

    await userEvent.click(getByDataTest('toggle-content'));

    expect(
      window.getComputedStyle(await findByDataTest('test-heightTransition-container')).overflow
    ).toBe('hidden');
  });

  it('From children to no children when `memoizeChildren` is passed', async () => {
    const { findByDataTest, getByDataTest } = testRender(
      <TestCmp displayContent memoizeChildren />
    );

    userEvent.click(getByDataTest('toggle-content'));
    fireEvent(getByDataTest('test-heightTransition-container'), transitionEndEvent);

    try {
      await findByDataTest('test-content');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('From no children to children when `memoizeChildren` is passed', async () => {
    const { findByDataTest, getByDataTest } = testRender(<TestCmp memoizeChildren />);

    userEvent.click(getByDataTest('toggle-content'));
    fireEvent(getByDataTest('test-heightTransition-container'), transitionEndEvent);

    expect(await findByDataTest('test-content')).toBeInTheDocument();
  });

  it('Pass `transitionDuration` and `transitionType` props', () => {
    const { getByDataTest } = testRender(
      <TestCmp displayContent transitionDuration={2000} transitionType="linear" />
    );

    expect(
      window.getComputedStyle(getByDataTest('test-heightTransition-container')).transition
    ).toBe('height 2000ms linear');
  });

  it('Pass `onTransitionEnd` prop', () => {
    const mockOnTransitionEnd = jest.fn();

    const { getByDataTest } = testRender(<TestCmp onTransitionEnd={mockOnTransitionEnd} />);

    fireEvent(getByDataTest('test-heightTransition-container'), transitionEndEvent);

    expect(mockOnTransitionEnd).toBeCalled();
  });

  it('With `event.propertyName` different from `height`', () => {
    transitionEndEvent.propertyName = 'width';
    const mockOnTransitionEnd = jest.fn();

    const { getByDataTest } = testRender(<TestCmp onTransitionEnd={mockOnTransitionEnd} />);

    fireEvent(getByDataTest('test-heightTransition-container'), transitionEndEvent);

    expect(mockOnTransitionEnd).toBeCalledTimes(0);
  });

  it('With `HeightTransitionProvider` and `isRoot` wrapper', async () => {
    const mockOnTransitionEnd = jest.fn();

    const { findByDataTest } = testRender(
      <HeightTransitionProvider>
        <HeightTransitionBox dataTest="test-root" isRoot onTransitionEnd={mockOnTransitionEnd}>
          <TestCmp onTransitionEnd={mockOnTransitionEnd} />
        </HeightTransitionBox>
      </HeightTransitionProvider>
    );

    userEvent.click(await findByDataTest('toggle-content'));
    fireEvent(await findByDataTest('test-heightTransition-container'), transitionEndEvent);
    fireEvent(await findByDataTest('test-root-heightTransition-container'), transitionEndEvent);

    expect(mockOnTransitionEnd).toBeCalledTimes(2);
  });

  it('Set current children in `onTransitionEnd` when `memoizeChildren` is passed', async () => {
    const { findByDataTest, getByDataTest, queryByDataTest } = testRender(
      <TestCmp memoizeChildren />
    );

    userEvent.click(getByDataTest('toggle-content'));
    fireEvent(getByDataTest('test-heightTransition-container'), transitionEndEvent);

    expect(await findByDataTest('test-content')).toBeInTheDocument();

    await userEvent.click(getByDataTest('toggle-content'));
    fireEvent(getByDataTest('test-heightTransition-container'), transitionEndEvent);

    expect(queryByDataTest('test-content')).not.toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('From no children to children and children to no children when `memoizeChildren` is passed', async () => {
    const { findByDataTest, getByDataTest, queryByDataTest } = testRender(
      <TestCmp memoizeChildren />
    );

    userEvent.click(getByDataTest('toggle-content'));
    fireEvent(getByDataTest('test-heightTransition-container'), transitionEndEvent);

    expect(await findByDataTest('test-content')).toBeInTheDocument();

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 0
    });

    await userEvent.click(getByDataTest('toggle-content'));
    fireEvent(getByDataTest('test-heightTransition-container'), transitionEndEvent);

    expect(queryByDataTest('test-content')).not.toBeInTheDocument();
    expect(getComputedStyle(getByDataTest('test-heightTransition-container')).height).toBe('0px');
  });

  it('Cannot trigger `onTransitionEnd` from nested element', async () => {
    const mockOnTransitionEnd = jest.fn();

    const { findByDataTest } = testRender(
      <TestCmp displayContent onTransitionEnd={mockOnTransitionEnd}>
        <div data-test="test-children" style={{ transition: 'height 300ms ease-in-out' }}></div>
      </TestCmp>
    );

    fireEvent(await findByDataTest('test-children'), transitionEndEvent);
    fireEvent(await findByDataTest('test-heightTransition-container'), transitionEndEvent);

    expect(mockOnTransitionEnd).toBeCalledTimes(1);
  });
});
