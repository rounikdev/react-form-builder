import { FC } from 'react';

import { testRender } from '@services/utils';

import { useClass } from '../useClass';

describe('useClass', () => {
  it('useClass creates the right classes', () => {
    const innerClass = 'Container';
    const outerClass = 'Selected';
    const updatedOuterClass = 'DarkMode';

    const TestComponent: FC<{ className: string; showOuterClass: boolean }> = ({
      className,
      showOuterClass
    }) => {
      return (
        <div
          className={useClass(
            [innerClass, showOuterClass && className],
            [className, showOuterClass]
          )}
          data-test="classes"
        ></div>
      );
    };

    const { getByDataTest, rerender } = testRender(
      <TestComponent className={outerClass} showOuterClass={true} />
    );

    expect(getByDataTest('classes')).toHaveClass(`${innerClass} ${outerClass}`);

    rerender(<TestComponent className={outerClass} showOuterClass={false} />);

    expect(getByDataTest('classes')).toHaveClass(`${innerClass}`);

    rerender(<TestComponent className={updatedOuterClass} showOuterClass={true} />);
    expect(getByDataTest('classes')).toHaveClass(`${innerClass} ${updatedOuterClass}`);
  });

  it('useClass creates the right classes when no dependency array provided', () => {
    const innerClass = 'Container';
    const outerClass = 'Selected';

    const TestComponent: FC<{ className: string; showOuterClass: boolean }> = ({
      className,
      showOuterClass
    }) => {
      return (
        <div
          className={useClass([innerClass, showOuterClass && className])}
          data-test="classes"
        ></div>
      );
    };

    const { getByDataTest, rerender } = testRender(
      <TestComponent className={outerClass} showOuterClass={true} />
    );

    expect(getByDataTest('classes')).toHaveClass(`${innerClass} ${outerClass}`);

    rerender(<TestComponent className={outerClass} showOuterClass={false} />);

    expect(getByDataTest('classes')).toHaveClass(`${innerClass} ${outerClass}`);
  });
});
