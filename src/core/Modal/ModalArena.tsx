import { FC, memo } from 'react';
import ReactDOM from 'react-dom';

import { useUpdateOnlyExtended } from '@rounik/react-custom-hooks';

import { ModalBuilder } from './components';
import { useModal } from './context';

const ModalArena: FC = () => {
  const {
    actions: { setModal },
    modalsToShow,
    orderList
  } = useModal();

  const modalEl = document.querySelector('#modal') as HTMLElement;

  useUpdateOnlyExtended(() => {
    if (orderList.length) {
      orderList.forEach(({ id }) => {
        setModal({ id });
      });
    }
  }, [orderList]);

  return (
    <>
      {Object.keys(modalsToShow).map((modalName) => {
        const { id, inline, ...otherProps } = modalsToShow[modalName];

        return modalEl && !inline
          ? ReactDOM.createPortal(<ModalBuilder {...otherProps} key={modalName} id={id} />, modalEl)
          : null;
      })}
    </>
  );
};

ModalArena.displayName = 'ModalArena';

export default memo(ModalArena);
