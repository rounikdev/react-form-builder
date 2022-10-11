import { mount } from '@cypress/react18';
import { FC, useState } from 'react';

import { HeightTransitionBox } from '../HeightTransitionBox';
import { HeightTransitionProvider } from '../HeightTransitionProvider';
import { HeightTransitionBoxProps } from '../types';

const TestCmp: FC<
  HeightTransitionBoxProps & {
    displayContent?: boolean;
    subContent?: (args: { toggleProp: boolean }) => JSX.Element;
    withProvider?: boolean;
  }
> = ({
  displayContent,
  memoizeChildren,
  onTransitionEnd,
  subContent,
  transitionDuration,
  transitionType,
  withProvider
}) => {
  const [showContent, setShowContent] = useState(displayContent ?? false);

  const [toggleProp, setToggleProp] = useState(false);

  return (
    <>
      <button
        data-test="toggle-content"
        onClick={() => setShowContent((prevState) => !prevState)}
        type="button"
      >
        Toggle
      </button>

      <button
        data-test="toggle-sub-content"
        onClick={() => setToggleProp((prevState) => !prevState)}
        type="button"
      >
        Toggle sub content padding
      </button>

      {!withProvider ? (
        <HeightTransitionBox
          dataTest="test"
          memoizeChildren={memoizeChildren}
          onTransitionEnd={onTransitionEnd}
          transitionDuration={transitionDuration}
          transitionType={transitionType}
        >
          {showContent ? (
            <div
              data-test="test-content"
              style={{ backgroundColor: 'red', height: 200, width: 200 }}
            />
          ) : null}

          {subContent ? subContent({ toggleProp }) : null}
        </HeightTransitionBox>
      ) : null}

      {withProvider ? (
        <HeightTransitionProvider>
          <HeightTransitionBox dataTest="test-root" isRoot onTransitionEnd={onTransitionEnd}>
            <HeightTransitionBox
              dataTest="test"
              memoizeChildren={memoizeChildren}
              onTransitionEnd={onTransitionEnd}
              transitionDuration={transitionDuration}
              transitionType={transitionType}
            >
              {showContent ? (
                <div
                  data-test="test-content"
                  style={{ backgroundColor: 'red', height: 200, width: 200 }}
                />
              ) : null}
            </HeightTransitionBox>
          </HeightTransitionBox>
        </HeightTransitionProvider>
      ) : null}
    </>
  );
};

describe('HeightTransitionBox', () => {
  it('Mounts', () => {
    mount(<HeightTransitionBox dataTest="test" />);

    cy.get('[data-test="test-heightTransition-container"]').should('exist');
  });

  it('Changes `overflow` based on transitioning state', () => {
    mount(<TestCmp />);

    cy.get('[data-test="test-heightTransition-container"]').should('have.css', 'overflow', 'auto');

    cy.get('[data-test="toggle-content"]').click();

    cy.get('[data-test="test-heightTransition-container"]').should('have.css', 'overflow', 'auto');
  });

  it('Changes `overflow` based on transitioning state with `memoizeChildren` flag', () => {
    mount(<TestCmp memoizeChildren />);

    cy.get('[data-test="test-heightTransition-container"]').should('have.css', 'overflow', 'auto');

    cy.get('[data-test="toggle-content"]').click();

    cy.get('[data-test="test-heightTransition-container"]').should('have.css', 'overflow', 'auto');
  });

  it('From children to no children when `memoizeChildren` is passed', () => {
    mount(<TestCmp displayContent memoizeChildren />);

    cy.get('[data-test="toggle-content"]').click();

    cy.get('[data-test="test-content"]').should('not.exist');
  });

  it('From no children to children when `memoizeChildren` is passed', () => {
    mount(<TestCmp memoizeChildren />);

    cy.get('[data-test="toggle-content"]').click();

    cy.get('[data-test="test-content"]').should('exist');
  });

  it('From no children to children and no children when `memoizeChildren` is passed', () => {
    mount(<TestCmp memoizeChildren />);

    cy.get('[data-test="toggle-content"]').click();

    cy.get('[data-test="test-content"]').should('exist');

    cy.get('[data-test="toggle-content"]').click();

    // TODO sporadically timeouts in `cy:prod:ct`
    cy.wait(600);
    cy.get('[data-test="test-content"]').should('not.exist');
  });

  it('Pass `transitionDuration` and `transitionType` props', () => {
    mount(<TestCmp displayContent transitionDuration={2000} transitionType="linear" />);

    cy.get('[data-test="test-heightTransition-container"]').should(
      'have.css',
      'transition',
      'height 2s linear 0s'
    );
  });

  it('Pass `onTransitionEnd` prop', () => {
    const mock = {
      fn() {}
    };

    cy.spy(mock, 'fn').as('args');

    mount(<TestCmp onTransitionEnd={mock.fn} />);

    cy.get('[data-test="toggle-content"]').click();

    cy.get('@args').should('have.been.called');
  });

  it('With `HeightTransitionProvider` and `isRoot` wrapper', () => {
    const mock = {
      fn() {}
    };

    cy.spy(mock, 'fn').as('args');

    mount(<TestCmp onTransitionEnd={mock.fn} withProvider />);

    cy.get('[data-test="toggle-content"]').click();

    cy.get('@args').should('have.been.calledTwice');
  });

  it('With `event.propertyName` different from `height`', () => {
    const mock = {
      fn() {}
    };

    cy.spy(mock, 'fn').as('args');

    const ChildCmp: FC<{ toggleProp: boolean }> = ({ toggleProp }) => (
      <div
        data-test="test-content-wrap"
        style={{
          padding: toggleProp ? 20 : 0,
          transition: 'padding 300ms ease-in-out'
        }}
      ></div>
    );

    mount(
      <TestCmp
        onTransitionEnd={mock.fn}
        subContent={({ toggleProp }) => {
          return <ChildCmp toggleProp={toggleProp} />;
        }}
      />
    );

    cy.get('[data-test="toggle-sub-content"]').click();

    cy.get('@args').should('not.have.been.called');
  });

  it('Cannot trigger `onTransitionEnd` from nested element', () => {
    const mock = {
      fn() {}
    };

    cy.spy(mock, 'fn').as('args');

    const ChildCmp: FC<{ toggleProp: boolean }> = ({ toggleProp }) => (
      <div
        data-test="test-content-wrap"
        style={{
          height: toggleProp ? 200 : 0,
          transition: 'height 300ms ease-in-out'
        }}
      ></div>
    );

    mount(
      <TestCmp
        onTransitionEnd={mock.fn}
        subContent={({ toggleProp }) => {
          return <ChildCmp toggleProp={toggleProp} />;
        }}
      />
    );

    cy.get('[data-test="toggle-sub-content"]').click();

    cy.get('@args').should('not.have.been.called');
  });
});
