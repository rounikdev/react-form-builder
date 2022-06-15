import { Field, FormStateEntryValue } from '@core';

export interface DatepickerProps extends Field<Date | undefined> {
  initialValue?: Date;
  maxDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  minDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  useEndOfDay?: boolean;
}
