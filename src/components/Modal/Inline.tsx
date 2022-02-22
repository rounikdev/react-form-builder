import { FC, memo, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { useUpdateOnly } from '@services';

import { ModalInlineProps } from './types';

import { useModal } from './context';
import { Container } from './components';

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
            <Container {...modal} alwaysRender={alwaysRender} id={id} visible={!!modal}>
              {children}
            </Container>,
            modalEl
          )
        : null}
    </>
  );
};

export default memo(Inline);
