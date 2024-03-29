import { Meta, Story } from '@storybook/react';

import { ModalBuilder } from '@core/Modal/components';
import { useModal } from '@core/Modal/context';
import { Provider } from '@core/Modal/provider';
import { ModalElement } from '@core/Modal/types';

import { BackdropAnimate, ContainerAnimate } from './components';

export default {
  component: ModalBuilder,
  title: 'Components/Modal/Basic'
} as Meta;

const Playground = (args: ModalElement): JSX.Element => {
  const {
    actions: { hideModalById, showModalById }
  } = useModal();

  return (
    <div id="modal">
      <button
        data-test="open-modal-1"
        onClick={() => {
          showModalById({
            ...args,
            content: (
              <p style={{ padding: '4rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 1</span>
                <br />
                <br />
                <button
                  data-test="hide-modal-4"
                  onClick={() => {
                    hideModalById({
                      id: 'modal-4'
                    });
                  }}
                >
                  Hide Modal 4
                </button>
                <br />
                <br />
                <button
                  data-test="open-modal-1-1"
                  onClick={() => {
                    showModalById({
                      ...args
                    });
                  }}
                >
                  Show Modal 1 1
                </button>
                <br />
                <br />
                <button
                  data-test="open-modal-2"
                  onClick={() => {
                    showModalById({
                      ...args,
                      animate: false,
                      content: (
                        <p style={{ padding: '4rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 2</span>
                          <br />
                          <br />
                          <button
                            data-test="open-modal-3"
                            onClick={() => {
                              showModalById({
                                ...args,
                                clearPreceding: true,
                                content: () => (
                                  <p style={{ padding: '4rem', textAlign: 'center' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                      Modal 3
                                    </span>
                                  </p>
                                ),
                                id: 'modal-3'
                              });
                            }}
                          >
                            Clear Preceding Show Modal 3
                          </button>
                        </p>
                      ),
                      forceShow: true,
                      id: 'modal-2'
                    });
                  }}
                >
                  Force Show Modal 2
                </button>
              </p>
            ),
            id: 'modal-1'
          });
        }}
      >
        Show Modal 1
      </button>
    </div>
  );
};

const Template: Story<ModalElement> = (args) => (
  <Provider baseAnimate BaseBackdrop={BackdropAnimate} BaseContainer={ContainerAnimate}>
    <Playground {...args} />
  </Provider>
);

export const Basic = Template.bind({});

Basic.args = {
  content: '',
  id: 'modal-1',
  onClose: () => void 0,
  preventModalBackdropClick: false
};
