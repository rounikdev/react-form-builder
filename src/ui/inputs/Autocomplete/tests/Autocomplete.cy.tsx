import { FC } from 'react';
import { mount } from '@cypress/react';

import { FormRoot } from '@core';
import { useFormRoot } from '@core/Form/providers';

import { Autocomplete } from '../Autocomplete';
import { Option } from '../components';
import { Fruit, fruitsValidator, options } from '../stories/data';

const extractId = (item: Fruit) => item.id ?? '';

const extractLabel = (item: Fruit) => item.label ?? '';

const ValueSetter: FC = () => {
  const {
    methods: { setFieldValue }
  } = useFormRoot();

  return (
    <div>
      <div
        data-test="set-single"
        onClick={() => {
          setFieldValue({ id: 'fruits', value: [options[0]] });
        }}
      >
        Set single
      </div>
      <div
        data-test="set-multiple"
        onClick={() => {
          setFieldValue({ id: 'fruits', value: [options[0], options[1]] });
        }}
      >
        Set multiple
      </div>
      <div
        data-test="set-different-multiple"
        onClick={() => {
          setFieldValue({ id: 'fruits', value: [options[1], options[2]] });
        }}
      >
        Set multiple
      </div>
      <div
        data-test="set-non-existing"
        onClick={() => {
          setFieldValue({ id: 'fruits', value: [{ id: 'tomatoes', label: 'tomatoes' }] });
        }}
      >
        Set non existing
      </div>
      <div
        data-test="set-non-existing-multiple"
        onClick={() => {
          setFieldValue({
            id: 'fruits',
            value: [
              { id: 'tomatoes', label: 'tomatoes' },
              { id: 'apples', label: 'apples' }
            ]
          });
        }}
      >
        Set non existing
      </div>
    </div>
  );
};

interface TestComponentProps {
  autocomplete?: boolean;
  initialValue?: Fruit[];
  multi?: boolean;
}

const TestComponent: FC<TestComponentProps> = ({ autocomplete, initialValue, multi }) => {
  return (
    <FormRoot dataTest="root">
      <Autocomplete
        autocomplete={autocomplete}
        dataTest="fruits"
        extractId={extractId}
        extractLabel={extractLabel}
        id="fruits"
        initialValue={initialValue}
        label="Fruits"
        list={options}
        multi={multi}
        name="fruits"
        renderOption={({ item, ref }) => (
          <Option dataTest={item.id} id={item.id} key={item.id} ref={ref} text={item.label} />
        )}
        validator={fruitsValidator}
      />
      <ValueSetter />
    </FormRoot>
  );
};

describe('Autocomplete', () => {
  it('Autocomplete with multi select and initial value', () => {
    mount(<TestComponent autocomplete initialValue={[options[1]]} multi />);

    // Closed with initial data:

    cy.get('[data-test="fruits-input"]').should('have.value', options[1].label);

    // Open:
    cy.get('[data-test="fruits-input"]').click();
    cy.get('[data-test="fruits-listbox"]').should('exist');
    cy.get('[data-test="fruits-listbox"] li').should('have.length', 6);
    cy.get('[data-test="fruits-input"]').should('have.value', '');

    // Deselect the initial value:
    cy.get(`[data-test="${options[1].id}-option"]`).should('have.attr', 'aria-selected', 'true');
    cy.get(`[data-test="${options[1].id}-option"]`).click();
    cy.get(`[data-test="${options[1].id}-option"]`).should('have.attr', 'aria-selected', 'false');

    // Browse the options using the keyboard:
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.focused().should('have.attr', 'data-test', `${options[0].id}-option`);
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.focused().should('have.attr', 'data-test', `${options[1].id}-option`);
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.focused().should('have.attr', 'data-test', `${options[2].id}-option`);
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.focused().should('have.attr', 'data-test', `${options[3].id}-option`);
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.focused().should('have.attr', 'data-test', `${options[4].id}-option`);
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.focused().should('have.attr', 'data-test', `${options[5].id}-option`);
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.focused().should('have.attr', 'data-test', `${options[0].id}-option`);
    cy.get('body').trigger('keyup', { code: 'ArrowUp' });
    cy.focused().should('have.attr', 'data-test', `${options[5].id}-option`);
    cy.get('body').trigger('keyup', { code: 'Home' });
    cy.focused().should('have.attr', 'data-test', `${options[0].id}-option`);
    cy.get('body').trigger('keyup', { code: 'End' });
    cy.focused().should('have.attr', 'data-test', `${options[5].id}-option`);

    // Select option through the keyboard:
    cy.get(`[data-test="${options[5].id}-option"]`).trigger('keyup', { code: 'Enter' });
    cy.get('[data-test="fruits-listbox"]').should('exist');
    cy.get(`[data-test="${options[5].id}-option"]`).should('have.attr', 'aria-selected', 'true');
    cy.get('body').trigger('keyup', { code: 'ArrowUp' });
    cy.get('body').trigger('keyup', { code: 'ArrowUp' });
    // Select a second one:
    cy.get(`[data-test="${options[3].id}-option"]`).trigger('keyup', { code: 'Enter' });
    cy.get(`[data-test="${options[3].id}-option"]`).should('have.attr', 'aria-selected', 'true');

    // Click on the input and type to filter the options:
    cy.get('[data-test="fruits-input"]').click().type('rr').should('have.value', 'rr');
    cy.get('[data-test="fruits-listbox"] li').should('have.length', 2);

    // Close by clicking outside:
    cy.get('body').click();
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('[data-test="fruits-input"]').should(
      'have.value',
      `${options[5].label}, ${options[3].label}`
    );

    // Set the value from outside:
    cy.get('[data-test="set-single"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'apples');

    cy.get('[data-test="set-multiple"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'apples, bananas');
    cy.get('[data-test="fruits-chips-list"] li').should('have.length', 2);

    cy.get('[data-test="set-non-existing"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'apples, bananas');
    cy.get('[data-test="fruits-chips-list"] li').should('have.length', 2);

    cy.get('[data-test="set-non-existing-multiple"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'apples, bananas');
    cy.get('[data-test="fruits-chips-list"] li').should('have.length', 2);

    cy.get('[data-test="set-different-multiple"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'bananas, strawberries');
    cy.get('[data-test="fruits-chips-list"] li').should('have.length', 2);

    cy.get('[data-test="fruits-chip-list-item-bananas"] button').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'strawberries');
    cy.get('[data-test="fruits-chips-list"] li').should('have.length', 1);

    // Clear on clicking Escape:
    cy.get('[data-test="fruits-input"]').click();
    cy.get('body').trigger('keyup', { code: 'Escape' });

    cy.get('[data-test="fruits-input"]').should('have.value', '');
    cy.get('[data-test="fruits-chips-list"] li').should('have.length', 0);
  });

  it('Autocomplete with single select and initial value', () => {
    mount(<TestComponent autocomplete initialValue={[options[1]]} />);

    // Closed with initial value:

    cy.get('[data-test="fruits-input"]').should('have.value', options[1].label);
    cy.get('[data-test="fruits-chips-list"]').should('not.exist');

    // Open:
    cy.get('[data-test="fruits-input"]').click();
    cy.get('[data-test="fruits-listbox"]').should('exist');
    cy.get('[data-test="fruits-listbox"] li').should('have.length', options.length);
    cy.get('[data-test="fruits-input"]').should('have.value', '');
    cy.get(`[data-test="${options[1].id}-option"]`).should('have.attr', 'aria-selected', 'true');

    // Click on the option and open again to check it's selected:
    cy.get(`[data-test="${options[1].id}-option"]`).click();

    cy.get('[data-test="fruits-input"]').click();
    cy.get(`[data-test="${options[1].id}-option"]`).should('have.attr', 'aria-selected', 'true');

    // Browse the options with the keyboard:
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('body').trigger('keyup', { code: 'ArrowDown' });
    cy.get('body').trigger('keyup', { code: 'ArrowUp' });

    // Select the last option:
    cy.get(`[data-test="${options[options.length - 1].id}-option"]`).trigger('keyup', {
      code: 'Enter'
    });

    cy.get('[data-test="fruits-input"]').should('have.value', options[options.length - 1].label);

    // Filter options:
    cy.get('[data-test="fruits-input"]').click().type('rr').should('have.value', 'rr');
    cy.get('[data-test="fruits-listbox"] li').should('have.length', 2);

    // Close by clicking outside:
    cy.get('body').click();

    // Set value from outside:
    cy.get('[data-test="set-single"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'apples');

    cy.get('[data-test="set-multiple"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'apples');

    cy.get('[data-test="set-non-existing"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'apples');

    cy.get('[data-test="set-non-existing-multiple"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'apples');

    cy.get('[data-test="set-different-multiple"]').click();
    cy.get('[data-test="fruits-input"]').should('have.value', 'bananas');
  });

  it('Autocomplete with no initial value', () => {
    mount(<TestComponent autocomplete />);

    // Closed with initial value:

    cy.get('[data-test="fruits-input"]').should('have.value', '');
    cy.get('[data-test="fruits-chips-list"]').should('not.exist');

    // Open:
    cy.get('[data-test="fruits-input"]').click();
    cy.get('[data-test="fruits-listbox"]').should('exist');
    cy.get('[data-test="fruits-listbox"] li').should('have.length', options.length);
    cy.get('[data-test="fruits-input"]').should('have.value', '');
  });

  it('Autocomplete with non existing option as initial value', () => {
    mount(<TestComponent autocomplete initialValue={[{ id: '2', label: 'dwd' }]} />);

    // Closed with initial value:

    cy.get('[data-test="fruits-input"]').should('have.value', '');
    cy.get('[data-test="fruits-chips-list"]').should('not.exist');

    // Open:
    cy.get('[data-test="fruits-input"]').click();
    cy.get('[data-test="fruits-listbox"]').should('exist');
    cy.get('[data-test="fruits-listbox"] li').should('have.length', options.length);
    cy.get('[data-test="fruits-input"]').should('have.value', '');
  });

  it('Dropdown mode', () => {
    mount(<TestComponent />);

    // Closed with initial value:

    cy.get('[data-test="fruits-input"]').should('have.value', '');
    cy.get('[data-test="fruits-chips-list"]').should('not.exist');

    // Open:
    cy.get('[data-test="fruits-input"]').click();
    cy.get('[data-test="fruits-listbox"]').should('exist');
    cy.get('[data-test="fruits-listbox"] li').should('have.length', options.length);
    cy.get('[data-test="fruits-input"]').should('have.value', '');

    // Select option:
    cy.get(`[data-test="${options[0].id}-option"]`).click();

    cy.get('[data-test="fruits-input"]').should('have.value', options[0].label);

    // Check if input is readonly:
    cy.get('[data-test="fruits-input"]').should('have.attr', 'readonly', 'readonly');
  });
});
