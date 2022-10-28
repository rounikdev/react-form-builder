import { FC, Fragment, memo, useMemo } from 'react';

import {
  ConditionalFields,
  FormArray,
  FormObject,
  FormRoot,
  FormSideEffect,
  FormUser,
  useFormStorage
} from '@core';
import { GlobalModel, ValidatorModel } from '@services';
import { Autocomplete, Button, Checkbox, Datepicker, ErrorField, Text } from '@ui';
import { Option } from '@ui/inputs/Autocomplete';

import {
  Contact,
  contactFactory,
  contactListValidator,
  contactValidator,
  initialContacts
} from '../../data';

import styles from '../../FormStories.scss';

export const options = [
  {
    id: 'cat',
    label: 'Cat'
  },
  {
    id: 'dog',
    label: 'Dog'
  },
  {
    id: 'horse',
    label: 'Horse'
  }
];

const formId = 'stepOne';

export const StepOne: FC = memo(() => {
  const { resetFormData, setFormData, state } = useFormStorage();

  const initialState = useMemo(() => {
    return state[formId]?.value ?? {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state[formId]?.value]);

  return (
    <FormRoot
      dataTest="user"
      initialResetState={state[formId]?.resetState}
      onChange={(formData) => {
        setFormData({ formData, formId });
      }}
      onReset={() => {
        console.log('reset step one');
        resetFormData({ formId });
      }}
      usesStorage
    >
      <FormSideEffect
        dependencyExtractor={(formData) => {
          return formData.firstName;
        }}
        effect={(dependency, { methods }) => {
          if (dependency === 'cat') {
            methods.root.setFieldsValue({ knowsKarate: true });
          }
        }}
      />
      <Checkbox
        dataTest="anonymous"
        id="anonymous"
        initialValue={initialState.anonymous}
        label="Is anonymous"
        name="anonymous"
      />
      <Autocomplete
        autocomplete
        className={styles.Field}
        dataTest="pet"
        extractId={(item) => item?.id ?? ''}
        extractLabel={(item) => item.label}
        id="pet"
        initialValue={initialState.pet}
        label="Pet"
        list={options}
        multi
        name="pet"
        renderOption={({ item, ref }) => (
          <Option dataTest={item.id} id={item.id} key={item.id} ref={ref} text={item.label} />
        )}
      />
      <Datepicker
        className={styles.Field}
        dataTest="birthDate"
        dependencyExtractor={(formData) => formData.anonymous}
        disabled={(anonymous) => anonymous}
        id="birth-date"
        initialValue={(anonymous) => (anonymous ? undefined : initialState.birthDate)}
        label="Birth date"
        name="birthDate"
      />
      <Text
        className={styles.Field}
        dependencyExtractor={(formData) => formData.anonymous}
        dataTest="first-name"
        disabled={(anonymous) => anonymous}
        id="first-name"
        initialValue={(anonymous) => (anonymous ? '' : initialState.firstName ?? '')}
        label="First Name"
        name="firstName"
        required={(anonymous) => !anonymous}
        validator={(value, anonymous) => {
          if (!anonymous) {
            return ValidatorModel.requiredValidator(value);
          } else {
            return {
              errors: [],
              valid: true
            };
          }
        }}
      />
      <Text
        className={styles.Field}
        dependencyExtractor={(formData) => ({
          anonymous: formData.anonymous,
          firstName: formData.firstName
        })}
        dataTest="last-name"
        disabled={({ anonymous, firstName }) => anonymous || firstName === 'cat'}
        id="last-name"
        initialValue={({ anonymous, firstName }) => {
          return anonymous ? '' : firstName === 'cat' ? 'Ninja' : initialState.lastName ?? '';
        }}
        label="Last Name"
        name="lastName"
        required={({ anonymous }) => !anonymous}
        validator={(value, { anonymous }) => {
          if (!anonymous) {
            return ValidatorModel.requiredValidator(value);
          } else {
            return {
              errors: [],
              valid: true
            };
          }
        }}
      />
      <Checkbox
        className={styles.Field}
        dataTest="knows-karate"
        id="knows-karate"
        initialValue={initialState.knowsKarate}
        label="Knows Karate"
        name="knowsKarate"
      />
      <ConditionalFields condition={(formData) => formData.knowsKarate}>
        <Text
          className={styles.Field}
          dependencyExtractor={(formData) => formData.firstName}
          dataTest="karate-belt"
          id="karate-belt"
          initialValue={(firstName) =>
            firstName === 'dog' ? 'Cat' : initialState.karateBelt ?? ''
          }
          label="Karate belt"
          name="karateBelt"
        />
        <Datepicker
          className={styles.Field}
          dataTest="belt-acquired"
          id="belt-acquired"
          initialValue={initialState.beltAcquired}
          label="Date belt acquired"
          name="beltAcquired"
        />
        <FormArray
          factory={contactFactory}
          initialValue={initialState.contacts ?? initialContacts}
          name="contacts"
          validator={contactListValidator}
        >
          {([contacts, addContact, removeContact, arrayErrors, arrayTouched, arrayFocused]) => {
            return (
              <FormUser>
                {({
                  formContext: {
                    isEdit,
                    methods: { cancel, edit, reset, save },
                    valid
                  },
                  formRootContext: { formData }
                }) => (
                  <>
                    <div className={styles.AddUserContainer}>
                      <Button dataTest="edit-contacts" onClick={edit} text="Edit contacts" />
                      <Button
                        dataTest="reset-contacts"
                        onClick={() => reset()}
                        text="Reset contacts"
                      />
                      <ul>
                        {((formData.contacts as Contact[]) || []).map((contact, index) => {
                          return Object.keys(contact).length ? (
                            <li key={contact.id ?? index}>
                              {contact.email}, {contact.phone}
                              {contact.isPrimary ? ', Primary' : ''}
                            </li>
                          ) : (
                            <Fragment key={index}></Fragment>
                          );
                        })}
                      </ul>
                    </div>
                    <div
                      className={GlobalModel.classer([
                        styles.ContactsForm,
                        isEdit && styles.Opened
                      ])}
                    >
                      {contacts.map((contact, contactIndex) => {
                        return (
                          <div className={styles.ContactContainer} key={contact.id}>
                            <div className={styles.Contact}>
                              <FormObject name={`${contactIndex}`} validator={contactValidator}>
                                <Text
                                  className={styles.Text}
                                  dataTest={`contact-email-${contactIndex}`}
                                  disabled={false}
                                  id={`contact-email-${contactIndex}`}
                                  initialValue={contact.email}
                                  label="Email"
                                  name="email"
                                />
                                <Text
                                  dataTest={`contact-id-${contactIndex}`}
                                  hidden
                                  id={`contact-id-${contactIndex}`}
                                  initialValue={contact.id}
                                  label="Id"
                                  name="id"
                                />
                                <Text
                                  className={styles.Text}
                                  dataTest={`contact-phone-${contactIndex}`}
                                  disabled={false}
                                  id={`contact-phone-${contactIndex}`}
                                  initialValue={contact.phone}
                                  label="Phone"
                                  name="phone"
                                />
                                <Checkbox
                                  className={styles.Checkbox}
                                  dataTest={`contact-is-primary-${contactIndex}`}
                                  disabled={false}
                                  id={`contact-is-primary-${contactIndex}`}
                                  initialValue={contact.isPrimary}
                                  label="Is Primary"
                                  name="isPrimary"
                                />
                                <Button
                                  dataTest={`remove-contact-${contactIndex}`}
                                  onClick={() => removeContact(contactIndex)}
                                  text="-"
                                />
                                <FormUser>
                                  {({
                                    formContext: {
                                      focused,
                                      formOnlyErrors,
                                      touched: contactTouched
                                    }
                                  }) => {
                                    return (
                                      <ErrorField
                                        dataTest={`contact-${contactIndex}`}
                                        errors={formOnlyErrors}
                                        isError={
                                          formOnlyErrors.length > 0 && contactTouched && !focused
                                        }
                                      />
                                    );
                                  }}
                                </FormUser>
                              </FormObject>
                            </div>
                          </div>
                        );
                      })}
                      <ErrorField
                        dataTest="contacts-list"
                        errors={arrayErrors}
                        isError={arrayErrors.length > 0 && arrayTouched && !arrayFocused}
                      />
                      <div className={styles.Actions}>
                        <Button dataTest="add-contact" onClick={addContact} text="Add Contact" />
                        <Button dataTest="cancel-edit-contacts" onClick={cancel} text="Cancel" />
                        {valid ? (
                          <Button dataTest="save-edit-contacts" onClick={save} text="Save" />
                        ) : null}
                      </div>
                    </div>
                  </>
                )}
              </FormUser>
            );
          }}
        </FormArray>
      </ConditionalFields>
      <FormUser>
        {({ formRootContext: { methods } }) => {
          return (
            <div>
              <Button dataTest="reset" onClick={() => methods.reset({})} text="Reset" />
            </div>
          );
        }}
      </FormUser>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </FormRoot>
  );
});

StepOne.displayName = 'StepOne';
