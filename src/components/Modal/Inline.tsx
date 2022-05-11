import { FC, memo, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useUpdateOnly } from '@rounik/react-custom-hooks';

import { ModalInlineProps } from './types';

import { useModal } from './context';
import { ModalBuilder } from './components';

export const Inline: FC<ModalInlineProps> = ({ alwaysRender, children, id }) => {
  const {
    modalsToShow,
    orderList,
    actions: { setModal }
  } = useModal();

  const modalEl = document.querySelector('#modal') as HTMLElement;

  const modal = useMemo(() => {
    return modalsToShow[id];
  }, [id, modalsToShow]);

  useUpdateOnly(() => {
    if (orderList.length) {
      orderList.forEach(({ id }) => {
        setModal({ id });
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
