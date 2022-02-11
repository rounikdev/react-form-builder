export type DefaultSingleOption = { label: string; value: string };

export type LabelExtractor<P, T> = (option: P) => T;

export type ValueExtractor<P, T> = (option: P) => T;

export type ValueBuilder<P, T> = ({ options, value }: { options: P[]; value: T }) => P | null;
