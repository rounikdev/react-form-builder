import { JSXElementConstructor, ReactElement } from 'react';

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
