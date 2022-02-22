import { FC } from 'react';
import { mount } from 'enzyme';

import { Modal } from '@components/UI';
import { waitForComponentToUpdate } from '@services';

import { ModalElement, ModalTemplateProps } from '../../../type-definitions';

import { Container } from '../Container';

interface TestActionButtonProps {
  action: 'setModal' | 'showModalById' | 'hideModalById';
}

const TestActionButton: FC<TestActionButtonProps> = ({ action }) => {
  const { actions } = Modal.useModal();

  return (
    <button
      data-test={`test-button-${action}`}
      onClick={(e) => actions[action](e.target as unknown as ModalElement)}
    ></button>
  );
};

const TestModalContent: FC<ModalElement> = ({ id }) => (
  <div data-test={`${id}-tmpl-content-modal`} />
);

describe('Modal actions', () => {
  const modalRoot = global.document.createElement('div');
  modalRoot.setAttribute('id', 'modal');
  const body = global.document.querySelector('body');
  body?.appendChild(modalRoot);

  afterAll(() => {
    body?.removeChild(modalRoot);
  });

  it('Has display name', () => {
    expect(Container.displayName).toBe('ModalContainer');
  });

  it('Mount Container with backdrop and content section', () => {
    const wrapper = mount(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
    buttonShowModalById.simulate('click', { target: { id: 'test' } });

    const modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    const modalSectionContent = wrapper.find('[data-test="test-content-modal"]');

    expect(modalBackdrop).toHaveLength(1);
    expect(modalSectionContent).toHaveLength(1);
  });

  it('Close on backdrop click, no close on section click', async () => {
    const wrapper = mount(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
    buttonShowModalById.simulate('click', { target: { id: 'test' } });

    let modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    let modalSectionContent = wrapper.find('[data-test="test-content-modal"]');

    modalSectionContent.simulate('click');
    modalSectionContent.simulate('animationend');

    modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    modalSectionContent = wrapper.find('[data-test="test-content-modal"]');

    expect(modalBackdrop).toHaveLength(1);
    expect(modalSectionContent).toHaveLength(1);

    modalBackdrop.simulate('click');
    modalBackdrop.simulate('animationend');

    await waitForComponentToUpdate(wrapper);

    modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    modalSectionContent = wrapper.find('[data-test="test-content-modal"]');

    expect(modalBackdrop).toHaveLength(0);
    expect(modalSectionContent).toHaveLength(0);
  });

  it('onClose callback fired', async () => {
    const mockOnClose = jest.fn();

    const wrapper = mount(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
    buttonShowModalById.simulate('click', {
      target: {
        id: 'test',
        onClose: mockOnClose
      }
    });

    let modalBackdrop = wrapper.find('[data-test="test-container-modal"]');

    modalBackdrop.simulate('click');
    modalBackdrop.simulate('animationend');

    await waitForComponentToUpdate(wrapper);

    modalBackdrop = wrapper.find('[data-test="test-container-modal"]');

    expect(modalBackdrop).toHaveLength(0);
    expect(mockOnClose).toBeCalledTimes(1);
  });

  it('Close on close button click', async () => {
    const wrapper = mount(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
    buttonShowModalById.simulate('click', {
      target: {
        id: 'test',
        hasCloseIcon: true
      }
    });

    let modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    const closeButton = wrapper.find('[data-test="test-close-modal-button"]');

    expect(closeButton).toHaveLength(1);

    closeButton.simulate('click');
    modalBackdrop.simulate('animationend');

    await waitForComponentToUpdate(wrapper);

    modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    expect(modalBackdrop).toHaveLength(0);
  });

  it('Pass function as content', () => {
    const wrapper = mount(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
    buttonShowModalById.simulate('click', {
      target: {
        id: 'test',
        content: (props: ModalTemplateProps) => <TestModalContent {...props} />
      }
    });

    const modalContent = wrapper.find('[data-test="test-tmpl-content-modal"]');

    expect(modalContent).toHaveLength(1);
  });

  it('Update backdrop `overflow`', async () => {
    const wrapper = mount(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
    buttonShowModalById.simulate('click', {
      target: {
        id: 'test'
      }
    });

    let modalBackdrop = wrapper.find('[data-test="test-container-modal"]');

    modalBackdrop.simulate('animationStart');

    await waitForComponentToUpdate(wrapper);

    modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    expect(modalBackdrop.props().style).toEqual({ overflow: 'hidden' });
  });

  it('Pass `hideBackdrop`', async () => {
    const wrapper = mount(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
    buttonShowModalById.simulate('click', {
      target: {
        id: 'test',
        hideBackdrop: true
      }
    });

    let modalBackdrop = wrapper.find('[data-test="test-container-modal"]');

    modalBackdrop.simulate('animationStart');

    await waitForComponentToUpdate(wrapper);

    modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    expect(modalBackdrop.props().className).toBe('Container Hide');
  });

  it('Trigger `closeAutomatically`', async () => {
    const wrapper = mount(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
        <TestActionButton action="hideModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
    buttonShowModalById.simulate('click', {
      target: {
        id: 'test',
        closeAutomatically: true
      }
    });

    let modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    modalBackdrop.simulate('animationStart');

    await waitForComponentToUpdate(wrapper);

    const buttonHideModalById = wrapper.find('[data-test="test-button-hideModalById"]');
    buttonHideModalById.simulate('click', {
      target: {
        id: 'test'
      }
    });

    modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    modalBackdrop.simulate('animationStart');

    await waitForComponentToUpdate(wrapper);

    modalBackdrop = wrapper.find('[data-test="test-container-modal"]');
    expect(modalBackdrop.props().className).toBe('Container Close');
  });

  describe('Modal Inline', () => {
    it('With `alwaysRender`', async () => {
      const wrapper = mount(
        <Modal.Provider>
          <TestActionButton action="showModalById" />
          <Modal.Inline alwaysRender id="modal-1">
            <TestActionButton action="hideModalById" />
          </Modal.Inline>
        </Modal.Provider>
      );

      const buttonHideModalById = wrapper.find('[data-test="test-button-hideModalById"]');
      expect(buttonHideModalById).toHaveLength(1);

      const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
      buttonShowModalById.simulate('click', {
        target: {
          id: 'modal-1',
          inline: true,
          closeAutomatically: true
        }
      });

      const modalBackdrop = wrapper.find('[data-test="modal-1-container-modal"]').hostNodes();
      modalBackdrop.simulate('animationStart');

      await waitForComponentToUpdate(wrapper);

      const container = wrapper.find(Container);
      expect(container.props().visible).toBe(true);
    });

    it('With no `alwaysRender`', async () => {
      const wrapper = mount(
        <Modal.Provider>
          <TestActionButton action="showModalById" />
          <Modal.Inline id="modal-1">
            <TestActionButton action="hideModalById" />
          </Modal.Inline>
        </Modal.Provider>
      );

      let buttonHideModalById = wrapper.find('[data-test="test-button-hideModalById"]');
      expect(buttonHideModalById).toHaveLength(0);

      const buttonShowModalById = wrapper.find('[data-test="test-button-showModalById"]');
      buttonShowModalById.simulate('click', {
        target: {
          id: 'modal-1',
          inline: true,
          closeAutomatically: true
        }
      });

      const modalBackdrop = wrapper.find('[data-test="modal-1-container-modal"]').hostNodes();
      modalBackdrop.simulate('animationStart');

      await waitForComponentToUpdate(wrapper);

      buttonHideModalById = wrapper.find('[data-test="test-button-hideModalById"]');
      expect(buttonHideModalById).toHaveLength(1);

      const container = wrapper.find(Container);
      expect(container.props().visible).toBe(true);
    });
  });
});
