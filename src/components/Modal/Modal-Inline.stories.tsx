import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button, Form, Input, useForm } from '@components/UI';

import { useModal } from './context';
import Modal from './Inline';
import { Provider } from './provider';
import { Container } from './components/Container/Container';

export default {
  component: Container,
  title: 'Components/Modal-Inline/Basic'
} as ComponentMeta<typeof Container>;

const Step_3_FormFields = () => {
  const { methods } = useForm();

  return (
    <>
      <Input.Primary
        dataTest={`firstName-modal-3`}
        id={`first-name-modal-3`}
        initialValue=""
        label="First Name"
        name="firstName"
      />
      <br />
      <br />
      <Input.Primary
        dataTest={`lastName-modal-3`}
        id={`last-name-modal-3`}
        initialValue=""
        label="Last Name"
        name="lastName"
      />
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button.Secondary dataTest="reset" onClick={methods.reset} size="Medium" text="reset" />
      </div>
    </>
  );
};

const Playground = (): JSX.Element => {
  const {
    actions: { showModalById }
  } = useModal();

  return (
    <div id="modal">
      <Form
        dataTest="users-form"
        formTag
        onChange={(value) => {
          console.log(value);
        }}
      >
        <Input.Primary
          dataTest={`firstName-modal-1`}
          id={`first-name-modal-1`}
          initialValue=""
          label="First Name"
          name="firstName"
        />
        <br />
        <br />
        <Button.Primary
          dataTest="show-modal-1"
          onClick={() => {
            showModalById({
              id: 'modal-1',
              inline: true
            });
          }}
          size="Medium"
          text="Show Modal 1"
        />

        <Modal id="modal-1" alwaysRender>
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 1</span>
            <br />
            <br />
            <Button.Primary
              dataTest="show-modal-2"
              onClick={() => {
                showModalById({
                  id: 'modal-2',
                  forceShow: true,
                  inline: true
                });
              }}
              size="Medium"
              text="Force Show Modal 2"
            />
          </div>
        </Modal>

        <br />
        <br />
        <Button.Primary
          dataTest="show-modal-2"
          onClick={() => {
            showModalById({
              id: 'modal-2',
              inline: true
            });
          }}
          size="Medium"
          text="Show Modal 2"
        />

        <Modal id="modal-2" alwaysRender>
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 2</span>
            <br />
            <br />
            <Button.Primary
              dataTest="show-modal-3"
              onClick={() => {
                showModalById({
                  id: 'modal-3',
                  clearPreceding: true,
                  inline: true
                });
              }}
              size="Medium"
              text="Clear Preceding Show Modal 3"
            />
          </div>
        </Modal>

        <br />
        <br />
        <Button.Primary
          dataTest="show-modal-3"
          onClick={() => {
            showModalById({
              id: 'modal-3',
              inline: true
            });
          }}
          size="Medium"
          text="Show Modal 3"
        />

        <Modal id="modal-3" alwaysRender>
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Modal 3</span>
            <Form name="modal 3 form">
              <Step_3_FormFields />
            </Form>
          </div>
        </Modal>
      </Form>
    </div>
  );
};

const Template: ComponentStory<typeof Container> = (): JSX.Element => (
  <Provider>
    <Playground />
  </Provider>
);

export const Basic = Template.bind({});
Basic.args = {};
