import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '@components/UI';

import { useModal } from './context';
import { Provider } from './provider';
import { Container } from './components/Container/Container';
import { ModalTemplateProps } from './type-definitions';

export default {
  component: Container,
  title: 'Components/Modal/Basic'
} as ComponentMeta<typeof Container>;

const Playground = (args: ModalTemplateProps): JSX.Element => {
  const {
    actions: { showModalById }
  } = useModal();

  return (
    <div id="modal">
      <Button.Primary
        dataTest="show-modal-1"
        onClick={() => {
          showModalById({
            ...args,
            id: 'modal-1',
            content: (
              <p style={{ padding: '4rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 1</span>
                <br />
                <br />
                <Button.Primary
                  dataTest="show-modal-2"
                  onClick={() => {
                    showModalById({
                      ...args,
                      id: 'modal-2',
                      content: (
                        <p style={{ padding: '4rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}> Modal 2</span>
                          <br />
                          <br />
                          <Button.Primary
                            dataTest="show-modal-3"
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
                            size="Medium"
                            text="Clear Preceding Show Modal 3"
                          />
                        </p>
                      ),
                      forceShow: true
                    });
                  }}
                  size="Medium"
                  text="Force Show Modal 2"
                />
              </p>
            )
          });
        }}
        size="Medium"
        text="Show Modal 1"
      />
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
  containerClass: '',
  content: '',
  contentClass: '',
  id: 'modal-1',
  onClose: () => void 0,
  preventModalBackdropClick: false
};
