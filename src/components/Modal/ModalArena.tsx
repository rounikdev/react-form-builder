import { FC, memo } from 'react';
import ReactDOM from 'react-dom';

import { useUpdateOnly } from '@rounik/react-custom-hooks';

import { useModal } from './context';
import { ModalBuilder } from './components';

const ModalArena: FC = () => {
  const {
    modalsToShow,
    orderList,
    actions: { setModal }
  } = useModal();

  const modalEl = document.querySelector('#modal') as HTMLElement;

  useUpdateOnly(() => {
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
