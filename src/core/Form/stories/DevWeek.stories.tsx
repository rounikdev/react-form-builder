import { Meta, Story } from '@storybook/react';
import { FC, StrictMode } from 'react';

import { FormArray, FormObject, FormRoot, FormUser } from '@core';
import { GlobalModel } from '@services';
import { Button, Checkbox, ErrorField, Text } from '@ui';

import { FormStateDisplaySimple } from './components';

import styles from './FormStories.scss';

export default {
  title: 'Demo/DevWeek-11-2022'
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

const Template: Story<FC> = () => {
  return (
    <StrictMode>
      <section className={styles.Container}>
        <div className={styles.FormContainer}>
          <FormRoot className={styles.Form} dataTest="user">
            <FormStateDisplaySimple />
            <Text
              className={styles.Text}
              dataTest="first-name"
              id="first-name"
              label="First name"
              name="firstName"
            />
            <Text
              className={styles.Text}
              dataTest="last-name"
              id="last-name"
              label="Last name"
              name="lastName"
            />
            <Text
              className={styles.Text}
              dataTest="password"
              id="password"
              label="Password"
              name="password"
              type="password"
            />
            <Text
              className={styles.Text}
              dataTest="repeat-password"
              id="repeat-password"
              label="Repeat password"
              name="repeatPassword"
              type="password"
            />
            <Text
              className={styles.Text}
              dataTest="credit-card"
              id="credit-card"
              label="Credit card number"
              name="creditCardNumber"
            />
            <FormArray factory={contactFactory} name="contacts">
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
                    }) => {
                      return (
                        <>
                          <div className={styles.AddUserContainer}>
                            <Button dataTest="edit-contacts" onClick={edit} text="Add contacts" />
                            <Button
                              dataTest="reset-contacts"
                              onClick={reset}
                              text="Reset contacts"
                            />
                            <ul>
                              {((formData.contacts as Contact[]) ?? []).map(
                                (contact, contactIndex) => {
                                  return (
                                    <li className={styles.ContactSaved} key={contactIndex}>
                                      <div className={styles.Row}>
                                        <div className={styles.Name}>Email:</div>
                                        <div>{contact.email}</div>
                                      </div>
                                      {contact.phone ? (
                                        <div className={styles.Row}>
                                          <div className={styles.Name}>Phone:</div>
                                          <div>{contact.phone}</div>
                                        </div>
                                      ) : null}
                                      {contact.isPrimary ? (
                                        <div className={styles.Row}>
                                          <div className={styles.Name}>Primary</div>
                                        </div>
                                      ) : null}
                                    </li>
                                  );
                                }
                              )}
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
                                    <FormObject name={`${contactIndex}`}>
                                      <div className={styles.ContactFieldsWrap}>
                                        <Text
                                          className={styles.Text}
                                          dataTest={`contact-email-${contactIndex}`}
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
                                          id={`contact-phone-${contactIndex}`}
                                          initialValue={contact.phone}
                                          label="Phone"
                                          name="phone"
                                        />
                                        <Checkbox
                                          className={styles.Checkbox}
                                          dataTest={`contact-is-primary-${contactIndex}`}
                                          id={`contact-is-primary-${contactIndex}`}
                                          initialValue={contact.isPrimary}
                                          label="Is Primary"
                                          name="isPrimary"
                                        />
                                        <Button
                                          className={styles.ButtonRemove}
                                          dataTest={`remove-contact-${contactIndex}`}
                                          onClick={() => removeContact(contactIndex)}
                                          text="-"
                                        />
                                      </div>
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
                            <div>
                              <ErrorField
                                dataTest="contacts-list"
                                errors={arrayErrors}
                                isError={arrayErrors.length > 0 && arrayTouched && !arrayFocused}
                              />
                            </div>
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
                      );
                    }}
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
                  <Button dataTest="reset-form" onClick={reset} text="Reset form" variant="Warn" />
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
