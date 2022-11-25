import {
  buildQueries,
  Matcher,
  MatcherOptions,
  Queries,
  queries,
  queryHelpers,
  render,
  RenderOptions
} from '@testing-library/react';
import { FC, JSXElementConstructor, MutableRefObject, ReactElement } from 'react';

import { useField } from '@core';

import { ShowHideProps, TestButtonProps, TestInputProps } from './types';

const queryAllByDataTest = (
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions | undefined
) => queryHelpers.queryAllByAttribute('data-test', container, id, options);

const getMultipleError = (c: Element | null, dataTestValue: string) =>
  `Found multiple elements with the data-test attribute of: ${dataTestValue}`;

const getMissingError = (c: Element | null, dataTestValue: string) =>
  `Unable to find an element with the data-test attribute of: ${dataTestValue}`;

const [queryByDataTest, getAllByDataTest, getByDataTest, findAllByDataTest, findByDataTest] =
  buildQueries(queryAllByDataTest, getMultipleError, getMissingError);

const dataTestQueries = {
  findAllByDataTest,
  findByDataTest,
  getAllByDataTest,
  getByDataTest,
  queryAllByDataTest,
  queryByDataTest
};

const newQueries = { ...queries, ...dataTestQueries };

export const testRender = <
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Q extends Queries = typeof newQueries,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Container extends Element | DocumentFragment = HTMLElement
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ui: ReactElement<any, string | JSXElementConstructor<any>>,
  options: RenderOptions<typeof newQueries, HTMLElement> = {}
) => render(ui, { queries: newQueries, ...options });

export const appendModalToRoot = () => {
  const modalRoot = global.document.createElement('div');
  modalRoot.setAttribute('id', 'modal');
  const body = global.document.querySelector('body');
  body?.appendChild(modalRoot);

  afterAll(() => {
    body?.removeChild(modalRoot);
  });
};

export const ShowHide: FC<ShowHideProps> = ({ children, data, show }) => {
  return children(show, data);
};

export const TestTextInput: FC<TestInputProps<string>> = ({
  dataTestInput = 'input',
  dataTestState = 'state',
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  onBlur,
  onFocus,
  sideEffect,
  validationDebounceTime,
  validator
}) => {
  const { fieldRef, ...state } = useField<string>({
    dependencyExtractor,
    formatter,
    initialValue: initialValue || '',
    name,
    onBlur,
    onFocus,
    sideEffect,
    validationDebounceTime,
    validator
  });
  return (
    <>
      <input
        aria-invalid={!state.valid}
        data-test={dataTestInput}
        onBlur={state.onBlurHandler}
        onChange={(event) => state.onChangeHandler(event.target.value)}
        onFocus={state.onFocusHandler}
        ref={fieldRef as MutableRefObject<HTMLInputElement>}
        value={state.value}
      />
      <div data-test={dataTestState}>{JSON.stringify(state)}</div>
    </>
  );
};

export const TestButton: FC<TestButtonProps> = ({
  dataTest,
  disabled,
  onClick,
  text,
  type = 'button'
}) => {
  return (
    <button data-test={`${dataTest}-button`} disabled={disabled} onClick={onClick} type={type}>
      {text}
    </button>
  );
};

export const keyEvent = (eventName: 'keyup' | 'keydown', code: string) => {
  const event = new KeyboardEvent(eventName, { code });
  document.dispatchEvent(event);
};
