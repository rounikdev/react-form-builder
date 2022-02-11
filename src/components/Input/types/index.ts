export type DefaultSingleOption = { label: string; value: string };

export type ExtractFromSingleOption<T, R> = (option: T) => R;

export type ValueBuilder<T, R> = ({ options, value }: { options: T[]; value: R }) => T | null;
