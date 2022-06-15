import { FC } from 'react';
import { act } from '@testing-library/react';

import { useMount } from '@rounik/react-custom-hooks';

import { testRender } from '@services/utils';

import { Translation } from '../components';
import { useTranslation } from '../hooks';
import { TranslationProvider } from '../providers';
import { Dictionaries } from '../types';

import { dictionaries, languages } from './data';

interface LanguageSetterProps {
  languageId: string;
}

const LanguageSetter: FC<LanguageSetterProps> = ({ languageId }) => {
  const { setLanguage } = useTranslation();

  useMount(() => {
    setTimeout(() => {
      setLanguage(languageId);
    });
  });

  return null;
};

interface DictionariesUpdaterProps {
  dictionaries: Dictionaries;
}

const DictionariesUpdater: FC<DictionariesUpdaterProps> = ({ dictionaries }) => {
  const { updateDictionaries } = useTranslation();

  useMount(() => {
    setTimeout(() => {
      updateDictionaries(dictionaries);
    });
  });

  return null;
};

const updatedTranslation = 'Название';

const newDictionaries = {
  ...dictionaries,
  BG: {
    ...dictionaries.BG,
    data: {
      ...dictionaries.BG.data,
      name: updatedTranslation
    }
  }
};

describe('Translation', () => {
  it('Translation returns translation key if not wrapped in TranslationProvider', () => {
    const translationKey = 'name';

    const { getByDataTest } = testRender(
      <p data-test="translation">
        <Translation text={translationKey} />
      </p>
    );

    expect(getByDataTest('translation')).toHaveTextContent(translationKey);
  });

  it('No translation update if calling setLanguage if not wrapped in TranslationProvider', () => {
    const translationKey = 'name';
    const newLanguageId = languages[1].id;

    jest.useFakeTimers();

    const { getByDataTest } = testRender(
      <p data-test="translation">
        <LanguageSetter languageId={newLanguageId} />
        <Translation text={translationKey} />
      </p>
    );

    jest.runAllTimers();

    expect(getByDataTest('translation')).toHaveTextContent(translationKey);
  });

  // eslint-disable-next-line max-len
  it('No translation update if calling updateDictionaries if not wrapped in TranslationProvider', () => {
    const translationKey = 'name';

    jest.useFakeTimers();

    const { getByDataTest } = testRender(
      <p data-test="translation">
        <DictionariesUpdater dictionaries={newDictionaries} />
        <Translation text={translationKey} />
      </p>
    );

    jest.runAllTimers();

    expect(getByDataTest('translation')).toHaveTextContent(translationKey);
  });

  it('Returns translation key if no data for the current language', () => {
    const languageId = 'GER';

    const translationKey = 'name';

    const { getByDataTest } = testRender(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <p data-test="translation">
          <Translation text={translationKey} />
        </p>
      </TranslationProvider>
    );

    expect(getByDataTest('translation')).toHaveTextContent(translationKey);
  });

  it('Translates without substitutes', () => {
    const languageId = languages[0].id;

    const translationKey = 'name';

    const { getByDataTest } = testRender(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <p data-test="translation">
          <Translation text={translationKey} />
        </p>
      </TranslationProvider>
    );

    expect(getByDataTest('translation')).toHaveTextContent(
      dictionaries[languageId].data[translationKey] as string
    );
  });

  it('Translates with text as substitute', () => {
    const languageId = languages[0].id;

    const translationKey = 'myNameIs';

    const substitute = 'Иван';

    const { getByDataTest } = testRender(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <p data-test="translation">
          <Translation substitutes={[substitute]} text={translationKey} />
        </p>
      </TranslationProvider>
    );

    expect(getByDataTest('translation')).toHaveTextContent(`Казвам се ${substitute}`);
  });

  it('Translates with jsx as substitute', () => {
    const languageId = languages[0].id;

    const translationKey = 'myNameIs';

    const substitute = <b>Иван</b>;

    const { getByDataTest } = testRender(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <p data-test="translation">
          <Translation substitutes={[substitute]} text={translationKey} />
        </p>
      </TranslationProvider>
    );

    expect(getByDataTest('translation')).toContainHTML(
      '<p data-test="translation">Казвам се <b>Иван</b>.</p>'
    );
  });

  it('Setting language updates translation', () => {
    const languageId = languages[0].id;
    const newLanguageId = languages[1].id;

    const translationKey = 'name';

    jest.useFakeTimers();

    const { getByDataTest } = testRender(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <LanguageSetter languageId={newLanguageId} />
        <p data-test="translation">
          <Translation text={translationKey} />
        </p>
      </TranslationProvider>
    );

    expect(getByDataTest('translation')).toHaveTextContent(
      dictionaries[languageId].data[translationKey] as string
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(getByDataTest('translation')).toHaveTextContent(
      dictionaries[newLanguageId].data[translationKey] as string
    );
  });

  it('Updating language updates translation', () => {
    const languageId = languages[0].id;

    const translationKey = 'name';

    jest.useFakeTimers();

    const { getByDataTest } = testRender(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <DictionariesUpdater dictionaries={newDictionaries} />
        <p data-test="translation">
          <Translation text={translationKey} />
        </p>
      </TranslationProvider>
    );

    expect(getByDataTest('translation')).toHaveTextContent(
      dictionaries[languageId].data[translationKey] as string
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(getByDataTest('translation')).toHaveTextContent(updatedTranslation);
  });
});
