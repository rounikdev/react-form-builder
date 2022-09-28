import { FC, memo, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { useUpdateOnlyExtended } from '@rounik/react-custom-hooks';

import { ModalBuilder } from './components';
import { useModal } from './context';
import { ModalInlineProps } from './types';

export const Inline: FC<ModalInlineProps> = ({ alwaysRender, children, id }) => {
  const {
    actions: { setModal },
    modalsToShow,
    orderList
  } = useModal();

  const modalEl = document.querySelector('#modal') as HTMLElement;

  const modal = useMemo(() => {
    return modalsToShow[id];
  }, [id, modalsToShow]);

  useUpdateOnlyExtended(() => {
    if (orderList.length) {
      orderList.forEach(({ id: elementId }) => {
        setModal({ id: elementId });
      });
    }
  }, [orderList]);

  return (
    <>
      {modalEl && (alwaysRender || modal)
        ? ReactDOM.createPortal(
            <ModalBuilder {...modal} alwaysRender={alwaysRender} id={id} visible={!!modal}>
              {children}
            </ModalBuilder>,
            modalEl
          )
        : null}
    </>
  );
};

export default memo(Inline);
