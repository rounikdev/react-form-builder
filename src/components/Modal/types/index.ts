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

export type ModalIds = {
  'modal-1': 'modal-1';
  'modal-2': 'modal-2';
  'modal-3': 'modal-3';
  addBankDetails: 'addBankDetails';
  addHolidayScheme: 'addHolidayScheme';
  addPensionScheme: 'addPensionScheme';
  addYearToDateFigures: 'addYearToDateFigures';
  termsAndConditionsWarn: 'termsAndConditionsWarn';
  signOutConfirmation: 'signOutConfirmation';
  submitWizardProgress: 'submitWizardProgress';
  submitRegisterLoading: 'submitRegisterLoading';
  submitRegisterSuccess: 'submitRegisterSuccess';
  submitRegisterWarn: 'submitRegisterWarn';
  warnPrompt: 'warnPrompt';
};

export interface ModalBackdropProps {
  children: ReactNode;
  id: keyof ModalIds;
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
  id: keyof ModalIds;
  isClosed: boolean;
  onCloseHandler: MouseEventHandler<HTMLButtonElement>;
  props: { style: CSSProperties };
}

export interface ModalElement {
  clearPreceding?: boolean;
  closeAutomatically?: boolean;
  Backdrop?: FC<ModalBackdropProps>;
  Container?: FC<ModalContainerProps>;
  content?: ReactNode;
  forceShow?: boolean;
  hideBackdrop?: boolean;
  id: keyof ModalIds;
  inline?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  overShow?: boolean;
  preventModalBackdropClick?: boolean;
}

export interface ModalInlineProps {
  alwaysRender?: boolean;
  children?: ReactNode;
  id: keyof ModalIds;
}

export interface ModalContainer extends Omit<ModalElement, 'inline'>, ModalInlineProps {
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
  id: keyof ModalIds;
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
  modalId: keyof ModalIds;
  setEditFormData: Dispatch<FormStateEntryValue>;
  shouldRenderInitially?: boolean;
  subFormName: string;
  warnPromptHeaderText?: string;
  warnPromptSubHeaderText?: string;
}
