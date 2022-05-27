import { FormStateEntryValue, UseFieldConfig } from '../../../Form';

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

export interface UseDatepickerArgs extends UseFieldConfig<Date | undefined> {
  maxDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  minDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  useEndOfDay?: boolean;
}
