import { Field, FormStateEntryValue } from '@core';

export interface DatepickerProps extends Field<Date | undefined> {
  maxDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  minDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  useEndOfDay?: boolean;
}
