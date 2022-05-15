import { FC, useState } from 'react';
import { mount } from '@cypress/react';

import { HeightTransitionBoxProps } from '../types';

import { HeightTransitionProvider } from '../HeightTransitionProvider';
import { HeightTransitionBox } from '../HeightTransitionBox';

const TestCmp: FC<
  HeightTransitionBoxProps & {
    displayContent?: boolean;
    withProvider?: boolean;
  }
> = ({
  displayContent,
  memoizeChildren,
  onTransitionEnd,
  transitionDuration,
  transitionType,
  withProvider
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

      {!withProvider ? (
        <HeightTransitionBox
          dataTest="test"
          memoizeChildren={memoizeChildren}
          onTransitionEnd={onTransitionEnd}
          transitionDuration={transitionDuration}
          transitionType={transitionType}
        >
          {showContent ? <div data-test="test-content" style={{ height: 200 }} /> : null}
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
              {showContent ? <div data-test="test-content" style={{ height: 200 }} /> : null}
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

    // TODO timeouts in `cy:prod:ct`
    // cy.wait(600);
    // cy.get('[data-test="test-content"]').should('not.exist');
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
});
