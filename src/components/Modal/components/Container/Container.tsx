import { FC, memo, useCallback, useMemo, useState } from 'react';

import { useClass, useMount, useUpdate } from '@services';

import { useModal } from '../../context';
import { ModalContainer } from '../../type-definitions';

import styles from './Container.scss';

export const Container: FC<ModalContainer> = memo((props) => {
  const {
    alwaysRender,
    children,
    closeAutomatically,
    containerClass,
    content,
    contentClass,
    hasCloseIcon,
    hideBackdrop,
    id,
    onClose,
    onOpen,
    preventModalBackdropClick,
    visible
  } = props;

  const {
    actions: { hideModalById, setModal },
    orderList
  } = useModal();

  const [isClosed, setIsClosed] = useState(false);
  const [overflow, setOverflow] = useState('hidden');

  const onCloseHandler = useCallback(() => {
    hideModalById({ id });
    onClose && onClose();
    setIsClosed(true);
  }, [hideModalById, id, onClose]);

  const onBackdropCloseHandler = useCallback(
    (event) => {
      if (
        typeof event.target.className?.indexOf === 'function' &&
        event.target.className.indexOf(styles.Container) !== -1
      ) {
        onCloseHandler();
      }
    },
    [onCloseHandler]
  );

  const onAnimationStartHandler = useCallback(async () => {
    await setOverflow('hidden');
  }, []);

  const onAnimationEndHandler = useCallback(async () => {
    await setOverflow('auto');

    if (orderList.length === 0) {
      setModal({ id });
    }
  }, [id, orderList.length, setModal]);

  const renderChildrenContent = useMemo(() => {
    const output = children || content || null;

    const renderOutput =
      typeof output === 'function' ? output({ ...props, close: onCloseHandler }) : output;

    return renderOutput;
  }, [children, content, props, onCloseHandler]);

  useMount(() => {
    if (!alwaysRender && onOpen) {
      onOpen && onOpen();
    }
  });

  useUpdate(() => {
    if (closeAutomatically && orderList.length === 0) {
      onCloseHandler();
    }
  }, [closeAutomatically, orderList]);

  useUpdate(() => {
    if (alwaysRender) {
      setIsClosed(!visible);

      if (visible && onOpen) {
        onOpen();
      }
    }
  }, [visible]);

  return (
    <div
      data-test={`${id}-container-modal`}
      className={useClass(
        [styles.Container, containerClass, hideBackdrop && styles.Hide, isClosed && styles.Close],
        [containerClass, hideBackdrop, isClosed]
      )}
      onClick={(event) => {
        !preventModalBackdropClick && onBackdropCloseHandler(event);
      }}
      onAnimationStart={onAnimationStartHandler}
      onAnimationEnd={onAnimationEndHandler}
      style={{
        overflow,
        ...(alwaysRender
          ? { visibility: visible ? 'visible' : 'hidden', opacity: visible ? 1 : 0 }
          : {})
      }}
    >
      <section
        data-test={`${id}-content-modal`}
        className={useClass(
          [styles.Content, contentClass, isClosed && styles.Close],
          [contentClass, isClosed]
        )}
        style={{
          ...(alwaysRender
            ? { visibility: visible ? 'visible' : 'hidden', opacity: visible ? 1 : 0 }
            : {})
        }}
      >
        {hasCloseIcon ? (
          <div className={styles.CloseIconWrap}>
            <button data-test={`${id}-close-modal`} onClick={onCloseHandler} type="button">
              X
            </button>
          </div>
        ) : null}
        {renderChildrenContent}
      </section>
    </div>
  );
});

Container.displayName = 'ModalContainer';
