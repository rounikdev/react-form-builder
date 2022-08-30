import { Meta, Story } from '@storybook/react';
import { FC, StrictMode } from 'react';

import { FormArray, FormObject, FormRoot, FormUser, Validator, ValidityCheck } from '@core';
import { GlobalModel } from '@services';
import { Button, Checkbox, ErrorField, Text } from '@ui';

import { FormStateDisplay } from './components';

import styles from './FormStories.scss';

export default {
  title: 'Demo/Form-With-Nested-Modals'
} as Meta;

interface Contact {
  email: string;
  id: string;
  isPrimary: boolean;
  phone: string;
}

const contactFactory: () => Contact = () => {
  return {
    email: '',
    id: `${new Date().getTime()}`,
    isPrimary: false,
    phone: ''
  };
};

const initialContacts: Contact[] = [
  {
    email: 'test@test.com',
    id: '0',
    isPrimary: true,
    phone: '0897654321'
  }
];

const contactValidator: Validator<Contact> = (contact) => {
  let validityCheck: ValidityCheck = {
    errors: [],
    valid: true
  };

  if (!contact.email && !contact.phone) {
    validityCheck = {
      errors: [{ text: `Enter email and/or phone` }],
      valid: false
    };
  }

  return validityCheck;
};

const contactListValidator: Validator<Contact[]> = (contacts) => {
  let validityCheck: ValidityCheck = {
    errors: [],
    valid: true
  };

  let primaryCount = 0;

  contacts.forEach((contact) => {
    if (contact.isPrimary) {
      primaryCount++;
    }
  });

  if (primaryCount !== 1) {
    validityCheck = {
      errors: [{ text: `Should have one and primary contact` }],
      valid: false
    };
  }

  return validityCheck;
};

const Template: Story<FC> = () => {
  return (
    <StrictMode>
      <section className={styles.Container}>
        <div className={styles.FormContainer}>
          <FormRoot
            className={styles.Form}
            dataTest="user"
            onSubmit={console.log}
            onReset={() => {
              console.log('Form reset');
            }}
          >
            <FormStateDisplay />
            <Text
              dataTest="first-name"
              disabled={false}
              id="first-name"
              label="First Name"
              name="firstName"
            />
            <Text
              dataTest="last-name"
              disabled={false}
              id="last-name"
              label="Last Name"
              name="lastName"
            />
            <FormArray
              factory={contactFactory}
              initialValue={initialContacts}
              name="contacts"
              validator={contactListValidator}
            >
              {([contacts, addContact, removeContact, arrayErrors, arrayTouched, arrayFocused]) => {
                return (
                  <FormUser>
                    {({
                      formContext: {
                        isEdit,
                        methods: { cancel, edit, save },
                        valid
                      },
                      formRootContext: { formData }
                    }) => (
                      <>
                        <div className={styles.AddUserContainer}>
                          <Button dataTest="edit-contacts" onClick={edit} text="Edit contacts" />
                          <ul>
                            {((formData.contacts as Contact[]) || []).map((contact) => {
                              return Object.keys(contact).length ? (
                                <li key={contact.id}>
                                  {contact.email}, {contact.phone}
                                  {contact.isPrimary ? ', Primary' : ''}
                                </li>
                              ) : null;
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
                                              formOnlyErrors.length > 0 &&
                                              contactTouched &&
                                              !focused
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
                            <Button
                              dataTest="add-contact"
                              onClick={addContact}
                              text="Add Contact"
                            />
                            <Button
                              dataTest="cancel-edit-contacts"
                              onClick={cancel}
                              text="Cancel"
                            />
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
            <FormUser>
              {({
                formContext: {
                  methods: { reset }
                }
              }) => (
                <div>
                  <Button dataTest="reset-form" onClick={reset} text="Reset form" />
                </div>
              )}
            </FormUser>
          </FormRoot>
        </div>
        <div className={styles.FormStateDisplay} id="form-state-display"></div>
      </section>
    </StrictMode>
  );
};

export const FormDemo = Template.bind({});
