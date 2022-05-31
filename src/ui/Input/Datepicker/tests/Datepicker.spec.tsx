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

const today = new Date();
const todayLocaleDateString = today.toLocaleDateString();

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayLocaleDateString = yesterday.toLocaleDateString();

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowLocaleDateString = tomorrow.toLocaleDateString();

describe('Datepicker', () => {
  it('Hide on outside click', () => {
    mount(content);

    cy.get('[data-test="from-datepicker-calendar"]').should('not.exist');

    // Open first calendar:
    cy.get('[data-test="from-datepicker-expand-button"]').click();
    cy.get('[data-test="from-datepicker-calendar"]').should('exist');

    cy.get('[data-test="to-datepicker-calendar"]').should('not.exist');

    // Open third calendar:
    cy.get('[data-test="to-datepicker-expand-button"]').click();
    cy.get('[data-test="to-datepicker-calendar"]').should('exist');

    // The first one should be closed:
    cy.get('[data-test="from-datepicker-calendar"]').should('not.exist');
  });

  it('Hide on Escape key', () => {
    mount(content);

    cy.get('[data-test="from-datepicker-calendar"]').should('not.exist');

    // Open first calendar:
    cy.get('[data-test="from-datepicker-expand-button"]').click();
    cy.get('[data-test="from-datepicker-calendar"]').should('exist');

    // Close with the Escape key:
    cy.get('body').trigger('keyup', { code: 'Escape' });
    cy.get('[data-test="from-datepicker-calendar"]').should('not.exist');
    cy.get('[data-test="from-datepicker-expand-button"]').should('be.focused');
  });

  // eslint-disable-next-line max-len
  it('Focuses the first day in calendar on Arrow key when no selected or today in the month', () => {
    mount(content);

    cy.get('[data-test="from-datepicker-input"]').type('01/03/2022');
    cy.get('[data-test="from-datepicker-expand-button"]').click();

    cy.get('[data-test="from-datepicker-next-month"]').click();

    cy.get('body').trigger('keyup', { code: 'ArrowLeft' });

    cy.focused().should('have.attr', 'data-date', new Date('28 Mar 2022').toLocaleDateString());
  });

  it('Change months using the arrow keys and moving through days', () => {
    mount(content);

    cy.get('[data-test="from-datepicker-input"]').type('01/03/2022');
    cy.get('[data-test="from-datepicker-expand-button"]').click();

    cy.get('[data-test="from-datepicker-next-month"]').click();

    cy.get('body').trigger('keyup', { code: 'ArrowLeft' });
    cy.get('body').trigger('keyup', { code: 'ArrowLeft' });

    cy.focused().should('have.attr', 'data-date', new Date('01 Mar 2022').toLocaleDateString());

    cy.get('body').trigger('keyup', { code: 'ArrowUp' });

    // The same date should be focused, because is selected:
    cy.focused().should('have.attr', 'data-date', new Date('01 Mar 2022').toLocaleDateString());

    for (let i = 0; i < 7; i++) {
      cy.get('body').trigger('keyup', { code: 'ArrowRight' });
    }

    cy.focused().should('have.attr', 'data-date', new Date('02 Mar 2022').toLocaleDateString());

    cy.focused().trigger('keyup', {
      code: 'Tab',
      keyCode: 9,
      which: 9,
      shiftKey: false,
      ctrlKey: false
    });

    cy.get('[data-test="from-datepicker-previous-month"]').trigger('keydown', {
      code: 'Tab',
      shiftKey: false
    });

    cy.get('[data-test="from-datepicker-previous-month"]').should('be.focused');
  });

  it('Enter date by typing in the input', () => {
    mount(content);

    cy.get('[data-test="from-datepicker-input"]').should('have.value', '');

    // Type an invalid date
    cy.get('[data-test="from-datepicker-input"]').type('99/99/9999').blur();
    cy.get('[data-test="from-datepicker-input"]').should('have.value', '');

    // Type a valid date
    cy.get('[data-test="from-datepicker-input"]').type('01/06/2021').blur();
    cy.get('[data-test="from-datepicker-input"]').should('have.value', '01/06/2021');

    // Try to type a date smaller than the min date:
    cy.get('[data-test="to-datepicker-input"]').type('31/05/2021').blur();
    cy.get('[data-test="to-datepicker-input"]').should('have.value', '');
  });

  it('Select date by key press', () => {
    mount(content);

    cy.get('[data-test="from-datepicker-expand-button"]').click();

    cy.get(`[data-test="from-datepicker-day-${todayLocaleDateString}"]`).trigger('keydown', {
      code: 'Enter'
    });
    cy.get('[data-test="from-datepicker-input"]').should('have.value', formatDateInput(today));

    // Clean the input by entering invalid data:
    cy.get('[data-test="from-datepicker-input"]').type('a').blur();

    cy.get('[data-test="from-datepicker-expand-button"]').click();

    cy.get(`[data-test="from-datepicker-day-${todayLocaleDateString}"]`).trigger('keydown', {
      code: 'Space'
    });
    cy.get('[data-test="from-datepicker-input"]').should('have.value', formatDateInput(today));

    // Clean the input by entering invalid data:
    cy.get('[data-test="from-datepicker-input"]').type('a').blur();

    cy.get('[data-test="from-datepicker-expand-button"]').click();

    // Try some other key:
    cy.get(`[data-test="from-datepicker-day-${todayLocaleDateString}"]`).trigger('keydown', {
      code: 'Escape'
    });

    cy.get('[data-test="from-datepicker-input"]').should('have.value', '');
  });

  it('Trying to select non-selectable date', () => {
    mount(content);

    cy.get('[data-test="from-datepicker-input"]').should('have.value', '');

    // Type a valid date in 'from' datepicker:
    cy.get('[data-test="from-datepicker-input"]').type('01/04/2022').blur();
    cy.get('[data-test="from-datepicker-input"]').should('have.value', '01/04/2022');

    // Open the 'to' calendar:
    cy.get('[data-test="to-datepicker-expand-button"]').click();

    cy.get('[data-test="to-datepicker-day-3/31/2022"]').should('be.disabled');
  });

  it('Navigate calendar forward with the month/year controls', () => {
    mount(content);

    const thisYear = today.getFullYear();
    const nextYear = thisYear + 1;
    const monthsTillNextYear = 12 - today.getMonth();

    // Open calendar:
    cy.get('[data-test="from-datepicker-expand-button"]').click();

    // Go forward changing month till the next year:
    for (let i = 1; i <= monthsTillNextYear; i++) {
      let monthIndex = today.getMonth() + i;

      if (monthIndex === 12) {
        monthIndex = 0;
      }

      cy.get('[data-test="from-datepicker-next-month"]').click();
      cy.get('[data-test="from-datepicker-month"]').should('contain', monthNames[monthIndex]);
    }

    cy.get('[data-test="from-datepicker-year"]').should('contain', nextYear);

    // Go to the next year by clicking the next year control:
    cy.get('[data-test="from-datepicker-next-year"]').click();
    cy.get('[data-test="from-datepicker-year"]').should('contain', nextYear + 1);
  });

  it('Navigate calendar backwards with the month/year controls', () => {
    mount(content);

    const thisYear = today.getFullYear();
    const lastYear = thisYear - 1;
    const monthsTillPreviousYear = today.getMonth() + 1;

    // Open calendar:
    cy.get('[data-test="from-datepicker-expand-button"]').click();

    // Go backwards changing month till the previous year:
    for (let i = 1; i <= monthsTillPreviousYear; i++) {
      let monthIndex = today.getMonth() - i;

      if (monthIndex === -1) {
        monthIndex = 11;
      }

      cy.get('[data-test="from-datepicker-previous-month"]').click();
      cy.get('[data-test="from-datepicker-month"]').should('contain', monthNames[monthIndex]);
    }

    cy.get('[data-test="from-datepicker-year"]').should('contain', lastYear);

    // Go to the next year by clicking the next year control:
    cy.get('[data-test="from-datepicker-previous-year"]').click();
    cy.get('[data-test="from-datepicker-year"]').should('contain', lastYear - 1);
  });

  it('Flow with min and max date', () => {
    mount(content);

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
