import { Field, FormStateEntryValue } from '../../../../components';

export interface DatepickerProps extends Field<Date | undefined> {
  initialValue?: Date;
  maxDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  minDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  useEndOfDay?: boolean;
}
