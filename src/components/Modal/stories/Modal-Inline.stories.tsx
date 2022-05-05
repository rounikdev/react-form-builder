import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FormObject, FormRoot, useForm } from '@components/Form';

import { Text as Input } from '@components/Input/stories/Text/Text';

import { useModal } from '@components/Modal/context';
import Modal from '@components/Modal/Inline';
import { Provider } from '@components/Modal/provider';
import { ModalBuilder } from '@components/Modal/components';

import { Backdrop, BackdropAnimate, Container, ContainerAnimate } from './components';

export default {
  component: ModalBuilder,
  title: 'Components/Modal-Inline/Basic'
} as ComponentMeta<typeof ModalBuilder>;

const Step_3_FormFields = () => {
  const { methods } = useForm();

  return (
    <>
      <Input
        dataTest={`firstName-modal-3`}
        id={`first-name-modal-3`}
        initialValue=""
        label="First Name"
        name="firstName"
      />
      <br />
      <br />
      <Input
        dataTest={`lastName-modal-3`}
        id={`last-name-modal-3`}
        initialValue=""
        label="Last Name"
        name="lastName"
      />
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => methods.reset()}>reset</button>
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
      <FormRoot
        dataTest="users-form"
        onChange={(value) => {
          console.log(value);
        }}
      >
        <button
          onClick={() => {
            showModalById({
              id: 'modal-1',
              inline: true
            });
          }}
        >
          Show Modal 1
        </button>

        <Modal id="modal-1" alwaysRender>
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 1</span>
            <br />
            <br />
            <button
              onClick={() => {
                showModalById({
                  id: 'modal-2',
                  animate: true,
                  Backdrop: BackdropAnimate,
                  Container: ContainerAnimate,
                  forceShow: true,
                  inline: true
                });
              }}
            >
              Force Show Modal 2
            </button>
          </div>
        </Modal>

        <br />
        <br />
        <button
          onClick={() => {
            showModalById({
              id: 'modal-2',
              animate: true,
              Backdrop: BackdropAnimate,
              Container: ContainerAnimate,
              inline: true
            });
          }}
        >
          Show Modal 2
        </button>

        <Modal id="modal-2" alwaysRender>
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 2</span>
            <br />
            <br />
            <button
              onClick={() => {
                showModalById({
                  id: 'modal-3',
                  forceShow: true,
                  inline: true
                });
              }}
            >
              Clear Preceding Show Modal 3
            </button>
          </div>
        </Modal>

        <br />
        <br />
        <button
          onClick={() => {
            showModalById({
              id: 'modal-3',
              inline: true
            });
          }}
        >
          Show Modal 3
        </button>

        <Modal id="modal-3" alwaysRender>
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Modal 3</span>
            <FormObject name="modal 3 form">
              <Step_3_FormFields />
            </FormObject>
          </div>
        </Modal>
      </FormRoot>
    </div>
  );
};

const Template: ComponentStory<typeof ModalBuilder> = (): JSX.Element => (
  <Provider BaseBackdrop={Backdrop} BaseContainer={Container}>
    <Playground />
  </Provider>
);

export const Basic = Template.bind({});
Basic.args = {};
