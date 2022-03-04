import { ComponentStory, ComponentMeta } from '@storybook/react';

import { useModal } from './context';
import { Provider } from './provider';
import { Container } from './components/Container/Container';
import { ModalElement } from './types';

export default {
  component: Container,
  title: 'Components/Modal/Basic'
} as ComponentMeta<typeof Container>;

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

const Template: ComponentStory<typeof Container> = (args): JSX.Element => (
  <Provider>
    <Playground {...args} />
  </Provider>
);

export const Basic = Template.bind({});
Basic.args = {
  backdropClass: '',
  content: '',
  containerClass: '',
  id: 'modal-1',
  onClose: () => void 0,
  preventModalBackdropClick: false
};
