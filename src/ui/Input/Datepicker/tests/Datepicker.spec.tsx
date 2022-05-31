import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import { formatDateInput, TranslationProvider } from '@components';
import { dictionaries } from '@components/Translation/tests/data';

import Meta, { DatepickerDemo } from '../stories/Datepicker.stories';

const DatepickerStory = composeStory(DatepickerDemo, Meta);

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const content = (
  <TranslationProvider dictionaries={dictionaries} languageId={dictionaries.EN.id}>
    <div style={{ margin: '5rem 0 5rem 20rem' }}>
      <DatepickerStory />
    </div>
  </TranslationProvider>
);

describe('Datepicker', () => {
  it('Selects date', () => {
    mount(content);

    const today = new Date();
    const todayLocaleDateString = today.toLocaleDateString();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayLocaleDateString = yesterday.toLocaleDateString();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowLocaleDateString = tomorrow.toLocaleDateString();

    cy.get('[data-test="from-datepicker-calendar"]').should('not.exist');

    // Open calendar:
    cy.get('[data-test="from-datepicker-expand-button"]').click();
    cy.get('[data-test="from-datepicker-calendar"]').should('exist');
    cy.get('[data-test="from-datepicker-month"]').should('contain', monthNames[today.getMonth()]);
    cy.get('[data-test="from-datepicker-year"]').should('contain', today.getFullYear());

    // Click on today:
    cy.focused().should('have.attr', 'data-date', todayLocaleDateString).click();
    cy.get('[data-test="from-datepicker-calendar"]').should('not.exist');
    cy.get('[data-test="from-datepicker-input"]').should('have.value', formatDateInput(today));

    // Type invalid date in the input:
    cy.get('[data-test="from-datepicker-input"]').type('a').blur();
    cy.get('[data-test="from-datepicker-input"]').should('have.value', '');

    // Open calendar:
    cy.get('[data-test="from-datepicker-expand-button"]').click();

    // Change month by clicking:
    cy.get('[data-test="from-datepicker-next-month"]').click();
    cy.get('[data-test="from-datepicker-month"]').should(
      'contain',
      monthNames[today.getMonth() + 1]
    );
    cy.get('[data-test="from-datepicker-previous-month"]').click();
    cy.get('[data-test="from-datepicker-month"]').should('contain', monthNames[today.getMonth()]);

    // Change year by clicking:
    cy.get('[data-test="from-datepicker-next-year"]').click();
    cy.get('[data-test="from-datepicker-year"]').should('contain', today.getFullYear() + 1);
    cy.get('[data-test="from-datepicker-previous-year"]').click();
    cy.get('[data-test="from-datepicker-year"]').should('contain', today.getFullYear());

    // Navigate calendar days with the arrows:
    cy.get('body').trigger('keyup', { code: 'ArrowLeft' });
    cy.get('body').trigger('keyup', { code: 'ArrowUp' });
    cy.get('body').trigger('keyup', { code: 'ArrowRight' });
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });

    // Select today:
    cy.focused().should('have.attr', 'data-date', todayLocaleDateString);
    cy.get(`[data-test="from-datepicker-day-${todayLocaleDateString}"]`)
      .should('exist')
      .trigger('keydown', { code: 'Enter' });
    cy.get('[data-test="from-datepicker-input"]').should('have.value', formatDateInput(today));

    // Open the third calendar:
    cy.get('[data-test="to-datepicker-expand-button"]').click();
    cy.get(`[data-test="to-datepicker-day-${yesterdayLocaleDateString}"]`).should('be.disabled');
    cy.get(`[data-test="to-datepicker-day-${tomorrowLocaleDateString}"]`).should('be.enabled');

    // Select today:
    cy.get(`[data-test="to-datepicker-day-${todayLocaleDateString}"]`).should('be.enabled').click();
    cy.get('[data-test="to-datepicker-input"]').should('have.value', formatDateInput(today));

    // Open the second calendar:
    cy.get('[data-test="between-datepicker-expand-button"]').click();
    cy.get(`[data-test="between-datepicker-day-${yesterdayLocaleDateString}"]`).should(
      'be.disabled'
    );
    cy.get(`[data-test="between-datepicker-day-${tomorrowLocaleDateString}"]`).should(
      'be.disabled'
    );

    // Select today:
    cy.get(`[data-test="between-datepicker-day-${todayLocaleDateString}"]`)
      .should('be.enabled')
      .trigger('keydown', { code: 'Space' });
    cy.get('[data-test="between-datepicker-input"]').should('have.value', formatDateInput(today));
  });
});
