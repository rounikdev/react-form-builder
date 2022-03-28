import { FC } from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from '@components';
import { appendModalToRoot, testRender } from '@services/utils';

import { ModalElement, ModalTemplateProps } from '@components/Modal/types';
import { Backdrop, Container } from '@components/Modal/stories/components';

import { ModalBuilder } from '../ModalBuilder';

interface TestActionButtonProps {
  action: 'setModal' | 'showModalById' | 'hideModalById';
}

const TestActionButton: FC<TestActionButtonProps> = ({ action }) => {
  const { actions } = Modal.useModal();

  return (
    <button
      data-test={`test-button-${action}`}
      onClick={(e) => actions[action](e.target as HTMLButtonElement as unknown as ModalElement)}
    ></button>
  );
};

const TestModalContent: FC<ModalElement> = ({ id }) => (
  <div data-test={`${id}-tmpl-container-modal`} />
);

describe('Modal actions', () => {
  appendModalToRoot();

  it('Has display name', () => {
    expect(ModalBuilder.displayName).toBe('ModalBuilder');
  });

  it('Mounts ModalBuilder with backdrop and content section', () => {
    const { getByDataTest } = testRender(
      <Modal.Provider BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test'
      }
    });

    expect(getByDataTest('test-backdrop-modal')).toBeInTheDocument();
    expect(getByDataTest('test-container-modal')).toBeInTheDocument();
  });

  it('Mounts ModalBuilder without backdrop and without content section', () => {
    const { getByDataTest, queryByDataTest } = testRender(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test'
      }
    });

    expect(queryByDataTest('test-backdrop-modal')).not.toBeInTheDocument();
    expect(queryByDataTest('test-container-modal')).not.toBeInTheDocument();
  });

  it('Mounts ModalBuilder with backdrop and without content section', () => {
    const { getByDataTest, queryByDataTest } = testRender(
      <Modal.Provider BaseBackdrop={Backdrop}>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test'
      }
    });

    expect(getByDataTest('test-backdrop-modal')).toBeInTheDocument();
    expect(queryByDataTest('test-container-modal')).not.toBeInTheDocument();
  });

  it('Closes on backdrop click, does not close on section click', async () => {
    const { findByDataTest, getByDataTest, queryByDataTest } = testRender(
      <Modal.Provider baseAnimate BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test'
      }
    });

    let modalBackdrop = getByDataTest('test-backdrop-modal');
    let modalSectionContent = getByDataTest('test-container-modal');

    userEvent.click(modalSectionContent);
    fireEvent.animationEnd(modalBackdrop);

    modalBackdrop = await findByDataTest('test-backdrop-modal');
    modalSectionContent = getByDataTest('test-container-modal');

    expect(modalBackdrop).toBeInTheDocument();
    expect(modalSectionContent).toBeInTheDocument();

    userEvent.click(modalBackdrop);
    fireEvent.animationEnd(modalBackdrop);

    expect(await findByDataTest('test-backdrop-modal')).not.toBeInTheDocument();
    expect(queryByDataTest('test-container-modal')).not.toBeInTheDocument();
  });

  it('onClose callback fired', async () => {
    const mockOnClose = jest.fn();

    const { findByDataTest, getByDataTest } = testRender(
      <Modal.Provider baseAnimate BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test',
        onClose: mockOnClose
      }
    });

    const modalBackdrop = getByDataTest('test-backdrop-modal');

    userEvent.click(modalBackdrop);
    fireEvent.animationEnd(modalBackdrop);

    expect(await findByDataTest('test-backdrop-modal')).not.toBeInTheDocument();
    expect(mockOnClose).toBeCalledTimes(1);
  });

  it('Closes on close button click', async () => {
    const { findByDataTest, getByDataTest } = testRender(
      <Modal.Provider baseAnimate BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test',
        hasDefaultClose: true
      }
    });

    const modalBackdrop = getByDataTest('test-backdrop-modal');
    const closeButton = getByDataTest('test-close-modal');

    expect(closeButton).toBeInTheDocument();

    userEvent.click(closeButton);
    fireEvent.animationEnd(modalBackdrop);

    expect(await findByDataTest('test-backdrop-modal')).not.toBeInTheDocument();
  });

  it('Pass function as content', () => {
    const { getByDataTest } = testRender(
      <Modal.Provider baseAnimate BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test',
        content: (props: ModalTemplateProps) => <TestModalContent {...props} />
      }
    });

    expect(getByDataTest('test-tmpl-container-modal')).toBeInTheDocument();
  });

  it('Update backdrop `overflow`', async () => {
    const { findByDataTest, getByDataTest } = testRender(
      <Modal.Provider baseAnimate BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test'
      }
    });

    fireEvent.animationStart(getByDataTest('test-backdrop-modal'));

    expect(getComputedStyle(await findByDataTest('test-backdrop-modal')).overflow).toBe('hidden');
  });

  it('Pass `hideBackdrop`', async () => {
    const { getByDataTest } = testRender(
      <Modal.Provider baseAnimate BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test',
        hideBackdrop: true
      }
    });

    expect(getComputedStyle(getByDataTest('test-backdrop-modal')).backgroundColor).toBe(
      'transparent'
    );
  });

  it('Trigger `closeAutomatically`', async () => {
    const { getByDataTest, queryByDataTest } = testRender(
      <Modal.Provider BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
        <TestActionButton action="hideModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');
    const buttonHideModalById = getByDataTest('test-button-hideModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test',
        closeAutomatically: true
      }
    });

    fireEvent.click(buttonHideModalById, {
      target: {
        id: 'test'
      }
    });

    expect(queryByDataTest('test-backdrop-modal')).not.toBeInTheDocument();
  });

  describe('Modal Inline', () => {
    it('With `alwaysRender`', async () => {
      const mockOnOpen = jest.fn();

      const { findByDataTest, getByDataTest } = testRender(
        <Modal.Provider baseAnimate BaseBackdrop={Backdrop} BaseContainer={Container}>
          <TestActionButton action="showModalById" />
          <Modal.Inline alwaysRender id="modal-1">
            <TestActionButton action="hideModalById" />
          </Modal.Inline>
        </Modal.Provider>
      );

      const buttonShowModalById = getByDataTest('test-button-showModalById');
      const buttonHideModalById = getByDataTest('test-button-hideModalById');

      expect(buttonHideModalById).toBeInTheDocument();

      fireEvent.click(buttonShowModalById, {
        target: {
          id: 'modal-1',
          inline: true,
          onOpen: mockOnOpen
        }
      });

      expect(mockOnOpen).toBeCalledTimes(1);

      expect(getComputedStyle(await findByDataTest('modal-1-backdrop-modal')).visibility).toBe(
        'visible'
      );

      fireEvent.click(buttonHideModalById, {
        target: {
          id: 'modal-1'
        }
      });

      fireEvent.animationEnd(getByDataTest('modal-1-backdrop-modal'));

      expect(getComputedStyle(await findByDataTest('modal-1-backdrop-modal')).visibility).toBe(
        'hidden'
      );
    });

    it('With no `alwaysRender`', async () => {
      const mockOnOpen = jest.fn();

      const { findByDataTest, getByDataTest, queryByDataTest } = testRender(
        <Modal.Provider baseAnimate BaseBackdrop={Backdrop} BaseContainer={Container}>
          <TestActionButton action="showModalById" />
          <Modal.Inline id="modal-1">
            <TestActionButton action="hideModalById" />
          </Modal.Inline>
        </Modal.Provider>
      );

      const buttonShowModalById = getByDataTest('test-button-showModalById');

      expect(queryByDataTest('test-button-hideModalById')).not.toBeInTheDocument();

      fireEvent.click(buttonShowModalById, {
        target: {
          id: 'modal-1',
          inline: true,
          onOpen: mockOnOpen
        }
      });

      expect(mockOnOpen).toBeCalledTimes(1);
      expect(await findByDataTest('test-button-hideModalById')).toBeInTheDocument();
    });
  });
});
