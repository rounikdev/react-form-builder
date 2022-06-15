/* eslint-disable testing-library/prefer-screen-queries */
import { FC } from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from '@core';
import { appendModalToRoot, testRender } from '@services/utils';

import { ModalElement } from '@core/Modal/types';
import { Backdrop, Container } from '@core/Modal/stories/components';

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
        value: JSON.stringify({ id: 'test_1', forceShow: true })
      }
    });
    expect(
      getByText(JSON.stringify({ test_1: { id: 'test_1', forceShow: true } }))
    ).toBeInTheDocument();

    fireEvent.click(buttonHideModalById, {
      target: {
        value: JSON.stringify({ id: 'test_1' })
      }
    });
    expect(getByText(JSON.stringify({ test: { id: 'test' } }))).toBeInTheDocument();

    fireEvent.click(buttonShowModalById, {
      target: {
        value: JSON.stringify({ id: 'test_2', clearPreceding: true })
      }
    });
    expect(
      getByText(JSON.stringify({ test_2: { id: 'test_2', clearPreceding: true } }))
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

    const modalBackdrop = getByDataTest('test-backdrop-modal');
    userEvent.click(modalBackdrop);

    expect(getByText(JSON.stringify({}))).toBeInTheDocument();
  });
});
