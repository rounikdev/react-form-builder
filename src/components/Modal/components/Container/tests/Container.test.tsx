import { FC } from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from '@components';
import { appendModalToRoot, testRender } from '@services/utils';

import { ModalElement, ModalTemplateProps } from '../../../types';

import { Container } from '../Container';

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
  <div data-test={`${id}-tmpl-content-modal`} />
);

describe('Modal actions', () => {
  appendModalToRoot();

  it('Has display name', () => {
    expect(Container.displayName).toBe('ModalContainer');
  });

  it('Mounts Container with backdrop and content section', () => {
    const { getByDataTest } = testRender(
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

    expect(getByDataTest('test-container-modal')).toBeInTheDocument();
    expect(getByDataTest('test-content-modal')).toBeInTheDocument();
  });

  it('Closes on backdrop click, does not close on section click', async () => {
    const { findByDataTest, getByDataTest, queryByDataTest } = testRender(
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

    let modalBackdrop = getByDataTest('test-container-modal');
    let modalSectionContent = getByDataTest('test-content-modal');

    userEvent.click(modalSectionContent);
    fireEvent.animationEnd(modalBackdrop);

    modalBackdrop = await findByDataTest('test-container-modal');
    modalSectionContent = getByDataTest('test-content-modal');

    expect(modalBackdrop).toBeInTheDocument();
    expect(modalSectionContent).toBeInTheDocument();

    userEvent.click(modalBackdrop);
    fireEvent.animationEnd(modalBackdrop);

    expect(await findByDataTest('test-container-modal')).not.toBeInTheDocument();
    expect(queryByDataTest('test-content-modal')).not.toBeInTheDocument();
  });

  it('onClose callback fired', async () => {
    const mockOnClose = jest.fn();

    const { findByDataTest, getByDataTest } = testRender(
      <Modal.Provider>
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

    const modalBackdrop = getByDataTest('test-container-modal');

    userEvent.click(modalBackdrop);
    fireEvent.animationEnd(modalBackdrop);

    expect(await findByDataTest('test-container-modal')).not.toBeInTheDocument();
    expect(mockOnClose).toBeCalledTimes(1);
  });

  it('Closes on close button click', async () => {
    const { findByDataTest, getByDataTest } = testRender(
      <Modal.Provider>
        <TestActionButton action="showModalById" />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        id: 'test',
        hasCloseIcon: true
      }
    });

    const modalBackdrop = getByDataTest('test-container-modal');
    const closeButton = getByDataTest('test-close-modal');

    expect(closeButton).toBeInTheDocument();

    userEvent.click(closeButton);
    fireEvent.animationEnd(modalBackdrop);

    expect(await findByDataTest('test-container-modal')).not.toBeInTheDocument();
  });

  it('Pass function as content', () => {
    const { getByDataTest } = testRender(
      <Modal.Provider>
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

    expect(getByDataTest('test-tmpl-content-modal')).toBeInTheDocument();
  });

  it('Update backdrop `overflow`', async () => {
    const { findByDataTest, getByDataTest } = testRender(
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

    fireEvent.animationStart(getByDataTest('test-container-modal'));

    expect(getComputedStyle(await findByDataTest('test-container-modal')).overflow).toBe('hidden');
  });

  it('Pass `hideBackdrop`', async () => {
    const { getByDataTest } = testRender(
      <Modal.Provider>
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

    expect(getByDataTest('test-container-modal')).toHaveClass('Hide');
  });

  it('Trigger `closeAutomatically`', async () => {
    const { findByDataTest, getByDataTest } = testRender(
      <Modal.Provider>
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

    expect(await findByDataTest('test-container-modal')).toHaveClass('Close');
  });

  describe('Modal Inline', () => {
    it('With `alwaysRender`', async () => {
      const mockOnOpen = jest.fn();

      const { findByDataTest, getByDataTest } = testRender(
        <Modal.Provider>
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

      expect(getComputedStyle(await findByDataTest('modal-1-container-modal')).visibility).toBe(
        'visible'
      );

      fireEvent.click(buttonHideModalById, {
        target: {
          id: 'modal-1'
        }
      });

      fireEvent.animationEnd(getByDataTest('modal-1-container-modal'));

      expect(getComputedStyle(await findByDataTest('modal-1-container-modal')).visibility).toBe(
        'hidden'
      );
    });

    it('With no `alwaysRender`', async () => {
      const mockOnOpen = jest.fn();

      const { findByDataTest, getByDataTest, queryByDataTest } = testRender(
        <Modal.Provider>
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
