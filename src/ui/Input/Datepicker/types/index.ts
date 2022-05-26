import { Field, FormStateEntryValue } from '../../../../components';

export interface DatepickerProps extends Field<Date | undefined> {
  className?: string;
  controlClass?: string;
  exitDuration?: number;
  iconClass?: string;
  initialValue?: Date;
  inputFieldClass?: string;
  maxDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  minDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  placeholder?: string;
  slideTimeout?: number;
  useEndOfDay?: boolean;
}

export type DatepickerChanged = {
  init?: boolean;
};

export interface DatepickerState {
  changed: DatepickerChanged;
  input: string | null;
  month: number;
  selected?: Date;
  today: Date;
  toLeft: boolean;
  show: boolean;
  year: number;
}
