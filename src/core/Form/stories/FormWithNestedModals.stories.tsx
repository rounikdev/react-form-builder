import { Meta, Story } from '@storybook/react';
import { FC, StrictMode } from 'react';

import {
  DependencyExtractor,
  FormArray,
  Formatter,
  FormObject,
  FormRoot,
  FormUser,
  Validator,
  ValidityCheck
} from '@core';
import { FormatterModel, GlobalModel, ValidatorModel } from '@services';
import { Button, Checkbox, ErrorField, Text } from '@ui';

import { FormStateDisplaySimple } from './components';
import { Contact, contactFactory, contactListValidator } from './data';

import styles from './FormStories.scss';

export default {
  title: 'Demo/Form-With-Nested-Modals'
} as Meta;

const passwordValidator = ValidatorModel.composeValidators(
  ValidatorModel.requiredValidator,
  ValidatorModel.createMinLengthValidator(4, 'At least 4 characters are required!'),
  ValidatorModel.createMaxLengthValidator(6, 'A maximum of 6 characters is allowed!')
);

const repeatPasswordValidator = ValidatorModel.composeValidators(
  passwordValidator,
  (value, dependencyValue) => {
    if (value === dependencyValue) {
      return { errors: [], valid: true };
    } else {
      return { errors: [{ text: `Passwords don't match!` }], valid: false };
    }
  }
);

const repeatPasswordDependencyExtractor: DependencyExtractor = (formData) => formData?.password;

const creditCardDependencyExtractor: DependencyExtractor = (formData) => formData?.formatCreditCard;

const creditCardValidator: Validator<string> = (value, dependencyValue) => {
  if (dependencyValue) {
    return ValidatorModel.creditCardValidator(value, 'Invalid credit card!');
  } else {
    let validityCheck: ValidityCheck;

    if (value.length === 16 || value === '') {
      validityCheck = {
        errors: [],
        valid: true
      };
    } else {
      validityCheck = {
        errors: [{ text: 'Invalid credit card!' }],
        valid: false
      };
    }

    return validityCheck;
  }
};

const creditCardFormatter: Formatter<string> = ({ dependencyValue, newValue, oldValue = '' }) => {
  if (dependencyValue) {
    return FormatterModel.creditCardFormatter({ newValue, oldValue });
  } else if (newValue.indexOf('  ') !== -1) {
    const trimmedValue = newValue.replaceAll('  ', '');

    return trimmedValue.length > 16 ? oldValue : trimmedValue;
  } else {
    return newValue.length > 16 ? oldValue : newValue;
  }
};

const emailCharSet = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailValidator = ValidatorModel.createCharacterSetValidator(emailCharSet, 'Invalid email!');

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
              required
              type="password"
              validator={passwordValidator}
            />
            <Text
              className={styles.Text}
              dataTest="repeat-password"
              dependencyExtractor={repeatPasswordDependencyExtractor}
              id="repeat-password"
              label="Repeat password"
              name="repeatPassword"
              required
              type="password"
              validator={repeatPasswordValidator}
            />
            <Checkbox
              className={styles.Checkbox}
              dataTest="format-credit-card"
              id="format-credit-card"
              label="Format credit card"
              name="formatCreditCard"
            />
            <Text
              className={styles.Text}
              dataTest="credit-card"
              dependencyExtractor={creditCardDependencyExtractor}
              formatter={creditCardFormatter}
              id="credit-card"
              label="Credit card number"
              name="creditCardNumber"
              type="creditCardNumber"
              validator={creditCardValidator}
            />
            <FormArray factory={contactFactory} name="contacts" validator={contactListValidator}>
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
                          <Button dataTest="edit-contacts" onClick={edit} text="Add contacts" />
                          <ul>
                            {((formData.contacts as Contact[]) ?? []).map(
                              (contact, contactIndex) => {
                                return (
                                  <li className={styles.ContactSaved} key={contactIndex}>
                                    {contact.email}, {contact.phone}
                                    {contact.isPrimary ? ', Primary' : ''}
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
                                        required
                                        validator={emailValidator}
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
                                        formatter={FormatterModel.integerOnlyFormatter}
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
