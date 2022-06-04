import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import Meta, { RangeDemo } from '../stories/Range.stories';
import { RANGE_INITIAL_VALUE } from '../stories/data';

const RangeStory = composeStory(RangeDemo, Meta);

const content = (
  <div style={{ margin: '5rem 0 5rem 20rem' }}>
    <RangeStory />
  </div>
);

describe('Range', () => {
  it('With min and max and no options', () => {
    mount(content);

    // Move 'to' slider:
    cy.get('[data-test="savings-range-slider-to"]')
      .should('have.attr', 'aria-valuenow', RANGE_INITIAL_VALUE.to)
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 200 })
      .should('have.attr', 'aria-valuenow', 4100)
      // Check that the max value limits the 'to' value:
      .trigger('mousemove', { clientX: 100 })
      .should('have.attr', 'aria-valuenow', 2100)
      // Check that the value 'from' limits the 'to' value:
      .trigger('mousemove', { clientX: 0 })
      .should('have.attr', 'aria-valuenow', RANGE_INITIAL_VALUE.from)
      .trigger('mousemove', { clientX: 200 })
      .trigger('mouseup');

    // Move the 'from' slider:
    cy.get('[data-test="savings-range-slider-from"]')
      .should('have.attr', 'aria-valuenow', RANGE_INITIAL_VALUE.from)
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 300 })
      .should('have.attr', 'aria-valuenow', 2000)
      // Check that the min value limits the 'from' value:
      .trigger('mousemove', { clientX: -100 })
      .should('have.attr', 'aria-valuenow', 0)
      // Check that the min value limits the 'from' value:
      .trigger('mousemove', { clientX: 400 })
      .should('have.attr', 'aria-valuenow', 4100);

    cy.get('[data-test="savings-range-container"]').trigger('mouseout');

    // Click on the track fro right of the 'to' slider:
    cy.get('[data-test="savings-range-track"]').trigger('click', { clientX: 500 });
    cy.get('[data-test="savings-range-slider-to"]').should('have.attr', 'aria-valuenow', 6000);

    // Click on the track from left of the 'from' slider:
    cy.get('[data-test="savings-range-track"]').trigger('click', { clientX: 300 });
    cy.get('[data-test="savings-range-slider-from"]').should('have.attr', 'aria-valuenow', 2000);

    // Change the values with the arrow keys:
    cy.get('[data-test="savings-range-slider-to"]')
      .focus()
      .trigger('keydown', { code: 'ArrowLeft' })
      .should('have.attr', 'aria-valuenow', 5999)
      .trigger('keydown', { code: 'ArrowRight' })
      .should('have.attr', 'aria-valuenow', 6000)
      .trigger('keydown', { code: 'ArrowUp' })
      .should('have.attr', 'aria-valuenow', 6100)
      .trigger('keydown', { code: 'ArrowDown' })
      .should('have.attr', 'aria-valuenow', 6000);
  });

  it('With min and max and no options and negative min value', () => {
    mount(content);

    cy.get('[data-test="deviation-range-slider-to"]').should('have.attr', 'aria-valuenow', 0);

    // Click on the track fro right of the 'to' slider:
    cy.get('[data-test="deviation-range-track"]').trigger('click', { clientX: 500 });
    cy.get('[data-test="deviation-range-slider-to"]').should('have.attr', 'aria-valuenow', 2);

    // Click on the track from left of the 'from' slider:
    cy.get('[data-test="deviation-range-track"]').trigger('click', { clientX: 300 });
    cy.get('[data-test="deviation-range-slider-from"]').should('have.attr', 'aria-valuenow', -6);
  });

  it('Single with min and max and no options', () => {
    mount(content);

    cy.get('[data-test="points-range-slider-from"]').should('not.exist');
    cy.get('[data-test="points-range-slider-to"]').should('have.attr', 'aria-valuenow', 1);

    // Click on the track fro right of the 'to' slider:
    cy.get('[data-test="points-range-track"]').trigger('click', { clientX: 500 });
    cy.get('[data-test="points-range-slider-to"]').should('have.attr', 'aria-valuenow', 60.4);
  });

  it('With options', () => {
    mount(content);

    cy.get('[data-test="budget-range-slider-to"]');

    // Click on the track fro right of the 'to' slider:
    cy.get('[data-test="budget-range-track"]').trigger('click', { clientX: 400 });
    cy.get('[data-test="budget-range-slider-to"]').should('have.attr', 'aria-valuenow', 600);
    // Click on the track fro right of the 'to' slider:
    cy.get('[data-test="budget-range-track"]').trigger('click', { clientX: 500 });
    cy.get('[data-test="budget-range-slider-to"]').should('have.attr', 'aria-valuenow', 1000);

    // Change value with the arrow keys:
    cy.get('[data-test="budget-range-slider-from"]')
      .should('have.attr', 'aria-valuenow', 200)
      .focus()
      .trigger('keydown', { code: 'ArrowRight' })
      .should('have.attr', 'aria-valuenow', 400)
      .trigger('keydown', { code: 'ArrowLeft' })
      .should('have.attr', 'aria-valuenow', 200)
      // Check that arrows can't set value
      // less than the smallest option:
      .trigger('keydown', { code: 'ArrowLeft' })
      .should('have.attr', 'aria-valuenow', 200)
      .trigger('keydown', { code: 'ArrowUp' })
      .should('have.attr', 'aria-valuenow', 400)
      .trigger('keydown', { code: 'ArrowDown' })
      .should('have.attr', 'aria-valuenow', 200)
      // Check that arrows can't set value
      // less than the smallest option:
      .trigger('keydown', { code: 'ArrowDown' })
      .should('have.attr', 'aria-valuenow', 200);

    // Check that arrows can't set value
    // higher than the largest option:
    cy.get('[data-test="budget-range-slider-to"]')
      .should('have.attr', 'aria-valuenow', 1000)
      .focus()
      .trigger('keydown', { code: 'ArrowRight' })
      .should('have.attr', 'aria-valuenow', 1200)
      .trigger('keydown', { code: 'ArrowRight' })
      .should('have.attr', 'aria-valuenow', 1400)
      .trigger('keydown', { code: 'ArrowRight' })
      .should('have.attr', 'aria-valuenow', 1400)
      .trigger('keydown', { code: 'ArrowDown' })
      .should('have.attr', 'aria-valuenow', 1200)
      .trigger('keydown', { code: 'ArrowUp' })
      .should('have.attr', 'aria-valuenow', 1400)
      .trigger('keydown', { code: 'ArrowUp' })
      .should('have.attr', 'aria-valuenow', 1400);
  });

  it('Single with options', () => {
    mount(content);

    cy.get('[data-test="volume-range-slider-from"]').should('not.exist');

    // Move 'to' slider:
    cy.get('[data-test="volume-range-slider-to"]')
      .should('have.attr', 'aria-valuenow', 10)
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 200 })
      .should('have.attr', 'aria-valuenow', 4)
      // Check if the value will be limited
      // to the largest option:
      .trigger('mousemove', { clientX: 1200 })
      .should('have.attr', 'aria-valuenow', 10)
      .trigger('mouseup');
  });
});
