import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import Meta, { CarouselDemo } from '../stories/Carousel.stories';

const CarouselStory = composeStory(CarouselDemo, Meta);

const content = (
  <div style={{ margin: '5rem 0 5rem 20rem' }}>
    <CarouselStory />
  </div>
);

describe('Carousel', () => {
  it('Manual mode using left and right button', () => {
    mount(content);

    cy.get('[data-test="2-image"]').should('be.visible');

    cy.get('[data-test="animals-carousel-left-button"]').trigger('click');

    cy.get('[data-test="1-image"]').should('be.visible');

    // Can't click before transition is done:
    cy.wait(500);
    cy.get('[data-test="animals-carousel-left-button"]').trigger('click');

    cy.get('[data-test="8-image-error"]').should('be.visible');

    cy.wait(500);
    cy.get('[data-test="animals-carousel-left-button"]').trigger('click');

    cy.get('[data-test="7-image"]').should('be.visible');

    cy.wait(500);
    cy.get('[data-test="animals-carousel-right-button"]').trigger('click');

    cy.get('[data-test="8-image-error"]').should('be.visible');

    cy.wait(500);
    cy.get('[data-test="animals-carousel-right-button"]').trigger('click');

    cy.get('[data-test="1-image"]').should('be.visible');
  });

  it('Manual mode using menu buttons', () => {
    mount(content);

    cy.get('[data-test="2-image"]').should('be.visible');

    cy.get('[data-test="animals-carousel-menu-button-item-0"]').trigger('click');

    cy.get('[data-test="1-image"]').should('be.visible');

    cy.get('[data-test="2-image"]').should('be.visible');

    cy.get('[data-test="animals-carousel-menu-button-item-7"]').trigger('click');

    cy.get('[data-test="8-image-error"]').should('be.visible');
  });

  it('Auto mode', () => {
    mount(content);

    cy.get('[data-test="2-image"]').should('be.visible');

    cy.get('[data-test="change-auto"]').trigger('click');

    cy.wait(2500);
    cy.get('[data-test="3-image"]').should('be.visible');

    cy.get('[data-test="change-auto"]').trigger('click');
  });

  it('Auto mode with pause on mouseover', () => {
    mount(content);

    cy.get('[data-test="2-image"]').should('be.visible');

    cy.get('[data-test="change-auto"]').trigger('click');

    // pause:
    cy.get('[data-test="animals-carousel-frame-current"]').trigger('mouseover');

    cy.wait(2500);
    cy.get('[data-test="2-image"]').should('be.visible');

    // un-pause:
    cy.get('[data-test="animals-carousel-frame-current"]').trigger('mouseout');

    cy.wait(2500);
    cy.get('[data-test="3-image"]').should('be.visible');

    cy.get('[data-test="change-auto"]').trigger('click');
  });

  it('Change images', () => {
    mount(content);

    cy.get('[data-test="2-image"]').should('be.visible').should('have.attr', 'alt', 'cat-2');

    cy.get('[data-test="change-images"]').trigger('click');

    cy.get('[data-test="2-image"]').should('be.visible').should('have.attr', 'alt', 'hamster-2');
  });
});
