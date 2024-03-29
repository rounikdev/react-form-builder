import {
  CSSProperties,
  FC,
  memo,
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';

import { useMount, useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { useModal } from '@core/Modal/context';
import { ModalBackdropProps, ModalBuilderProps } from '@core/Modal/types';

const DEFAULT_ANIMATION_PROPERTIES: CSSProperties = {
  animationDelay: '0s',
  animationDirection: 'normal',
  animationDuration: '0s',
  animationFillMode: 'none',
  animationIterationCount: 1,
  animationName: 'none',
  animationPlayState: 'running',
  animationTimingFunction: 'ease'
};

export const ModalBuilder: FC<ModalBuilderProps> = (props) => {
  const {
    alwaysRender,
    animate,
    Backdrop,
    children,
    closeAutomatically,
    Container,
    content,
    hideBackdrop,
    id,
    onClose,
    onOpen,
    preventModalBackdropClick,
    visible
  } = props;

  const {
    actions: { hideModalById, setModal },
    baseAnimate,
    BaseBackdrop,
    BaseContainer,
    modalsToShow,
    orderList
  } = useModal();

  const BackdropTag = useMemo(() => Backdrop || BaseBackdrop, [Backdrop, BaseBackdrop]);
  const ContainerTag = useMemo(() => Container || BaseContainer, [BaseContainer, Container]);

  const backdropRef = useRef<HTMLDivElement | null>(null);

  const [isClosed, setIsClosed] = useState(false);
  const [overflow, setOverflow] = useState('hidden');

  const hasAnimation = useMemo(
    () => animate || (animate === undefined && baseAnimate),
    [animate, baseAnimate]
  );

  const onCloseHandler = useCallback(() => {
    hideModalById({ id });

    if (onClose) {
      onClose();
    }

    setIsClosed(true);
  }, [hideModalById, id, onClose]);

  const onBackdropCloseHandler: MouseEventHandler = useCallback(
    (event) => {
      if (backdropRef.current === event.target) {
        onCloseHandler();
      }
    },
    [onCloseHandler]
  );

  const clearModalsToShow = useCallback(() => {
    if (orderList.length === 0) {
      setModal({ id });
    }
  }, [id, orderList.length, setModal]);

  const onAnimationStartHandler = useCallback(async () => {
    await setOverflow('hidden');
  }, []);

  const onAnimationEndHandler = useCallback(async () => {
    await setOverflow('auto');

    clearModalsToShow();
  }, [clearModalsToShow]);

  const onBackdropClick: MouseEventHandler = useCallback(
    (event) => {
      if (!preventModalBackdropClick) {
        onBackdropCloseHandler(event);
      }
    },
    [onBackdropCloseHandler, preventModalBackdropClick]
  );

  const renderChildrenContent = useMemo(() => {
    const output = children || content || null;

    const renderOutput =
      typeof output === 'function'
        ? output({ ...props, close: onCloseHandler } as unknown as ModalBackdropProps & {
            close: () => void;
          })
        : output;

    return renderOutput;
  }, [children, content, props, onCloseHandler]);

  const backdropStyle: CSSProperties = useMemo(
    () => ({
      animationFillMode: isClosed ? 'forwards' : 'none',
      overflow,
      ...(alwaysRender
        ? { opacity: visible ? 1 : 0, visibility: visible ? 'visible' : 'hidden' }
        : {}),
      ...(hideBackdrop ? { backgroundColor: 'transparent' } : {}),
      ...(!hasAnimation ? DEFAULT_ANIMATION_PROPERTIES : {})
    }),
    [alwaysRender, hasAnimation, hideBackdrop, isClosed, overflow, visible]
  );

  const contentStyle: CSSProperties = useMemo(
    () => ({
      animationFillMode: isClosed ? 'forwards' : 'none',
      ...(alwaysRender
        ? { opacity: visible ? 1 : 0, visibility: visible ? 'visible' : 'hidden' }
        : {}),
      ...(!hasAnimation ? DEFAULT_ANIMATION_PROPERTIES : {})
    }),
    [alwaysRender, hasAnimation, isClosed, visible]
  );

  const backdropProps = useMemo(
    () => ({
      onAnimationEnd: onAnimationEndHandler,
      onAnimationStart: onAnimationStartHandler,
      onClick: onBackdropClick,
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
      onOpen();
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

  useUpdateOnly(() => {
    if (modalsToShow[id] && !hasAnimation) {
      clearModalsToShow();
    }
  }, [clearModalsToShow, hasAnimation]);

  return BackdropTag ? (
    <BackdropTag id={id} isClosed={isClosed} props={backdropProps}>
      {ContainerTag ? (
        <ContainerTag
          id={id}
          isClosed={isClosed}
          onCloseHandler={onCloseHandler}
          props={containerProps}
        >
          {renderChildrenContent}
        </ContainerTag>
      ) : null}
    </BackdropTag>
  ) : null;
};

ModalBuilder.displayName = 'ModalBuilder';

export default memo(ModalBuilder);
