import {
  AnimationEventHandler,
  CSSProperties,
  Dispatch,
  FC,
  MouseEventHandler,
  ReactNode,
  RefObject
} from 'react';

import { FormStateEntryValue } from '../../Form/types';

export type ModalId = string;

export interface ModalBackdropProps {
  children: ReactNode;
  id: ModalId;
  isClosed: boolean;
  props: {
    onClick: MouseEventHandler<HTMLDivElement>;
    onAnimationStart: AnimationEventHandler<HTMLDivElement>;
    onAnimationEnd: AnimationEventHandler<HTMLDivElement>;
    ref: RefObject<HTMLDivElement>;
    style: CSSProperties;
  };
}

export interface ModalContainerProps {
  children: ReactNode;
  id: ModalId;
  isClosed: boolean;
  onCloseHandler: MouseEventHandler<HTMLButtonElement>;
  props: { style: CSSProperties };
}

export interface ModalElement {
  animate?: boolean;
  clearPreceding?: boolean;
  closeAutomatically?: boolean;
  Backdrop?: FC<ModalBackdropProps>;
  Container?: FC<ModalContainerProps>;
  content?: ReactNode;
  forceShow?: boolean;
  hideBackdrop?: boolean;
  id: ModalId;
  inline?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  overShow?: boolean;
  preventModalBackdropClick?: boolean;
}

export interface ModalInlineProps {
  alwaysRender?: boolean;
  children?: ReactNode;
  id: ModalId;
}

export interface ModalBuilderProps extends Omit<ModalElement, 'inline'>, ModalInlineProps {
  visible?: boolean;
}

export interface ModalTemplateProps extends Omit<ModalElement, 'onClose'> {
  close: () => void;
}

export type ModalAction = (modal: ModalElement) => void;

export interface ModalContext {
  actions: {
    [key: string]: ModalAction;
  };
  baseAnimate?: boolean;
  BaseBackdrop?: FC<ModalBackdropProps>;
  BaseContainer?: FC<ModalContainerProps>;
  modalsToShow: { [key: string]: ModalElement };
  orderList: ModalElement[];
}

export interface ModalInfoProps extends ModalTemplateProps {
  contentText?: string;
  headerText: string;
  subHeaderText?: string;
  type: 'Success' | 'Warn';
}

export interface ModalLoaderProps extends ModalTemplateProps {
  headerText: string;
}

export interface ModalCustomActionProps {
  addBtnTxt: string;
  alwaysRender?: boolean;
  btnGroupClassName?: string;
  disableConfirm?: boolean;
  children: ReactNode;
  headerTxt?: string;
  id: ModalId;
  onCancel?: () => void;
  onConfirm: () => void;
}

export interface ModalWarnPromptProps extends ModalTemplateProps {
  headerText: string;
  onCancel?: () => void;
  onConfirm: () => void;
  subHeaderText?: string;
}

export interface ModalSubFormEditChildrenProps {
  alwaysRender: boolean;
  isEdit: boolean;
  isValid: boolean;
  onAdd: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onOpenForm: () => void;
  subFormData: FormStateEntryValue;
}

export interface ModalSubFormEditWrapProps {
  children: (props: ModalSubFormEditChildrenProps) => JSX.Element;
  editFormData: FormStateEntryValue;
  modalId: ModalId;
  setEditFormData: Dispatch<FormStateEntryValue>;
  shouldRenderInitially?: boolean;
  subFormName: string;
  warnPromptHeaderText?: string;
  warnPromptSubHeaderText?: string;
}
