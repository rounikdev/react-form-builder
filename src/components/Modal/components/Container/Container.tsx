import { CSSProperties, FC, memo, useCallback, useMemo, useRef, useState } from 'react';

import { useClass, useMount, useUpdate } from '@services';

import { useModal } from '../../context';
import { ModalContainer } from '../../types';
import { CloseIcon } from './components';

import styles from './Container.scss';

export const Container: FC<ModalContainer> = memo((props) => {
  const {
    alwaysRender,
    children,
    closeAutomatically,
    backdrop,
    backdropAttributes,
    backdropClass,
    backdropEnterAnimation = styles.EnterAnimation,
    backdropExitAnimation = styles.ExitAnimation,
    closeIcon,
    closeIconClass,
    content,
    containerAttributes,
    containerClass,
    containerEnterAnimation = styles.ContainerEnterAnimation,
    containerExitAnimation = styles.ContainerExitAnimation,
    hasDefaultClose,
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

  const backdropRef = useRef<HTMLDivElement | null>(null);

  const [isClosed, setIsClosed] = useState(false);
  const [overflow, setOverflow] = useState('hidden');

  const onCloseHandler = useCallback(() => {
    hideModalById({ id });
    onClose && onClose();
    setIsClosed(true);
  }, [hideModalById, id, onClose]);

  const onBackdropCloseHandler = useCallback(
    (event) => {
      if (backdropRef.current === event.target) {
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

  const onBackdropClick = useCallback(
    (event) => {
      !preventModalBackdropClick && onBackdropCloseHandler(event);
    },
    [onBackdropCloseHandler, preventModalBackdropClick]
  );

  const renderChildrenContent = useMemo(() => {
    const output = children || content || null;

    const renderOutput =
      typeof output === 'function' ? output({ ...props, close: onCloseHandler }) : output;

    return renderOutput;
  }, [children, content, props, onCloseHandler]);

  const backdropClasses = useClass(
    [backdropEnterAnimation, isClosed && backdropExitAnimation, hideBackdrop && styles.Hide],
    [backdropEnterAnimation, backdropExitAnimation, hideBackdrop, isClosed]
  );

  const backdropStyle: CSSProperties = useMemo(
    () => ({
      overflow,
      ...(alwaysRender
        ? { visibility: visible ? 'visible' : 'hidden', opacity: visible ? 1 : 0 }
        : {})
    }),
    [alwaysRender, overflow, visible]
  );

  const containerClasses = useClass(
    [containerEnterAnimation, isClosed && containerExitAnimation],
    [containerEnterAnimation, containerExitAnimation, isClosed]
  );

  const contentStyle: CSSProperties = useMemo(
    () => ({
      ...(alwaysRender
        ? { visibility: visible ? 'visible' : 'hidden', opacity: visible ? 1 : 0 }
        : {})
    }),
    [alwaysRender, visible]
  );

  const closeIconClasses = useClass([styles.CloseBtn, closeIconClass], [closeIconClass]);

  const backdropProps = useMemo(
    () => ({
      onClick: onBackdropClick,
      onAnimationStart: onAnimationStartHandler,
      onAnimationEnd: onAnimationEndHandler,
      ref: backdropRef,
      style: backdropStyle
    }),
    [backdropStyle, onAnimationEndHandler, onAnimationStartHandler, onBackdropClick]
  );

  const containerProps = useMemo(
    () => ({
      style: contentStyle
    }),
    [contentStyle]
  );

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
      {...backdropProps}
      className={useClass(
        [styles.Backdrop, backdropClass, backdropClasses],
        [backdropClass, backdropClasses]
      )}
      data-test={`${id}-backdrop-modal`}
      {...backdropAttributes}
    >
      <section
        {...containerProps}
        className={useClass(
          [styles.Container, containerClass, containerClasses],
          [containerClass, containerClasses]
        )}
        data-test={`${id}-container-modal`}
        {...containerAttributes}
      >
        {hasDefaultClose || closeIcon ? (
          <button
            className={closeIconClasses}
            data-test={`${id}-close-modal`}
            onClick={onCloseHandler}
            type="button"
          >
            {hasDefaultClose ? <CloseIcon /> : closeIcon}
          </button>
        ) : null}
        {renderChildrenContent}
      </section>
    </div>
  );
});

Container.displayName = 'ModalContainer';
