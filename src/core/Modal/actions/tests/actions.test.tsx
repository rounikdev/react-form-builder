/* eslint-disable testing-library/prefer-screen-queries */
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FC } from 'react';

import { Modal } from '@core';
import { Backdrop, Container } from '@core/Modal/stories/components';
import { ModalElement } from '@core/Modal/types';
import { appendModalToRoot, testRender } from '@services/utils';

const StateReader: FC = () => {
  const { modalsToShow, orderList } = Modal.useModal();

  return (
    <>
      <div data-test="modalsToShow">{JSON.stringify(modalsToShow)}</div>
      <div data-test="orderList">{JSON.stringify(orderList)}</div>
    </>
  );
};

interface TestActionButtonProps {
  action: 'setModal' | 'showModalById' | 'hideModalById';
}

const TestActionButton: FC<TestActionButtonProps> = ({ action }) => {
  const { actions } = Modal.useModal();

  return (
    <button
      data-test={`test-button-${action}`}
      onClick={(e) =>
        actions[action](
          JSON.parse((e.target as HTMLButtonElement).value) as unknown as ModalElement
        )
      }
    ></button>
  );
};

describe('Modal actions', () => {
  appendModalToRoot();

  it('Multiple modal show, forceShow, clearPreceding, hideModalById', () => {
    const { getByDataTest, getByText } = testRender(
      <Modal.Provider BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
        <TestActionButton action="hideModalById" />
        <StateReader />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');
    const buttonHideModalById = getByDataTest('test-button-hideModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        value: JSON.stringify({ id: 'test' })
      }
    });
    expect(getByText(JSON.stringify({ test: { id: 'test' } }))).toBeInTheDocument();

    fireEvent.click(buttonShowModalById, {
      target: {
        value: JSON.stringify({ forceShow: true, id: 'test_1' })
      }
    });
    expect(
      getByText(JSON.stringify({ test_1: { forceShow: true, id: 'test_1' } }))
    ).toBeInTheDocument();

    fireEvent.click(buttonHideModalById, {
      target: {
        value: JSON.stringify({ id: 'test_1' })
      }
    });
    expect(getByText(JSON.stringify({ test: { id: 'test' } }))).toBeInTheDocument();

    fireEvent.click(buttonShowModalById, {
      target: {
        value: JSON.stringify({ clearPreceding: true, id: 'test_2' })
      }
    });
    expect(
      getByText(JSON.stringify({ test_2: { clearPreceding: true, id: 'test_2' } }))
    ).toBeInTheDocument();
  });

  it('hideModalById of a non existing modal', () => {
    const { getByDataTest, getByText } = testRender(
      <Modal.Provider BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />
        <TestActionButton action="hideModalById" />
        <StateReader />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');
    const buttonHideModalById = getByDataTest('test-button-hideModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        value: JSON.stringify({ id: 'test' })
      }
    });
    expect(getByText(JSON.stringify({ test: { id: 'test' } }))).toBeInTheDocument();

    fireEvent.click(buttonHideModalById, {
      target: {
        value: JSON.stringify({ id: 'test_1' })
      }
    });
    expect(getByText(JSON.stringify({ test: { id: 'test' } }))).toBeInTheDocument();
  });

  it('showModalById of an existing modal', () => {
    const { getByDataTest, getByText } = testRender(
      <Modal.Provider BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />

        <StateReader />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        value: JSON.stringify({ id: 'test' })
      }
    });
    expect(getByText(JSON.stringify({ test: { id: 'test' } }))).toBeInTheDocument();

    fireEvent.click(buttonShowModalById, {
      target: {
        value: JSON.stringify({ id: 'test' })
      }
    });
    expect(getByText(JSON.stringify({ test: { id: 'test' } }))).toBeInTheDocument();
  });

  it('Clear modal on backdrop click', async () => {
    const { getByDataTest, getByText } = testRender(
      <Modal.Provider BaseBackdrop={Backdrop} BaseContainer={Container}>
        <TestActionButton action="showModalById" />

        <StateReader />
      </Modal.Provider>
    );

    const buttonShowModalById = getByDataTest('test-button-showModalById');

    fireEvent.click(buttonShowModalById, {
      target: {
        value: JSON.stringify({ id: 'test' })
      }
    });
    //! https://github.com/testing-library/user-event/issues/565
    jest.useRealTimers();

    const modalBackdrop = getByDataTest('test-backdrop-modal');
    await userEvent.click(modalBackdrop);

    expect(getByText(JSON.stringify({}))).toBeInTheDocument();
  });
});
