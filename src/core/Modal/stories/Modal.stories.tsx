import { ComponentStory, ComponentMeta } from '@storybook/react';

import { useModal } from '@core/Modal/context';
import { Provider } from '@core/Modal/provider';
import { ModalBuilder } from '@core/Modal/components';
import { ModalElement } from '@core/Modal/types';

import { BackdropAnimate, ContainerAnimate } from './components';

export default {
  component: ModalBuilder,
  title: 'Components/Modal/Basic'
} as ComponentMeta<typeof ModalBuilder>;

const Playground = (args: ModalElement): JSX.Element => {
  const {
    actions: { showModalById }
  } = useModal();

  return (
    <div id="modal">
      <button
        onClick={() => {
          showModalById({
            ...args,
            id: 'modal-1',
            content: (
              <p style={{ padding: '4rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 1</span>
                <br />
                <br />
                <button
                  onClick={() => {
                    showModalById({
                      ...args,
                      id: 'modal-2',
                      animate: false,
                      content: (
                        <p style={{ padding: '4rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 2</span>
                          <br />
                          <br />
                          <button
                            onClick={() => {
                              showModalById({
                                ...args,
                                id: 'modal-3',
                                content: (
                                  <p style={{ padding: '4rem', textAlign: 'center' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                      Modal 3
                                    </span>
                                  </p>
                                ),
                                clearPreceding: true
                              });
                            }}
                          >
                            Clear Preceding Show Modal 3
                          </button>
                        </p>
                      ),
                      forceShow: true
                    });
                  }}
                >
                  Force Show Modal 2
                </button>
              </p>
            )
          });
        }}
      >
        Show Modal 1
      </button>
    </div>
  );
};

const Template: ComponentStory<typeof ModalBuilder> = (args): JSX.Element => (
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