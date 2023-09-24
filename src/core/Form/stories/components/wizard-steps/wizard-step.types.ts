export enum WizardStepID {
  NAME = 'NAME',
  REVIEW = 'REVIEW',
  SUPPLIER_A = 'SUPPLIER_A',
  SUPPLIER_B = 'SUPPLIER_B',
  SUPPLIER_B_URL = 'SUPPLIER_B_URL',
  TYPE = 'TYPE'
}

export enum SupplierType {
  BASIC = 'basic',
  CUSTOM = 'custom'
}

export interface WizardStepProp<StepIDType> {
  currentStep: StepIDType;
  setStep?: (stepID: StepIDType) => void;
}
