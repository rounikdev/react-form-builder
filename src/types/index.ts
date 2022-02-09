export interface Animatable {
  animate?: boolean;
  animateDataTest?: string;
  animateDuration?: number;
  animateMemoizeChildren?: boolean;
  contentClassName?: string;
}

export interface Stylable {
  className?: string;
}

export interface Testable {
  dataTest: string;
}

export interface Hideable {
  hidden?: boolean;
}

export interface Disableable {
  disabled?: boolean;
}
