import { mount } from '@cypress/react18';
import { FC } from 'react';

import { Translation } from '../components';
import { useTranslation } from '../hooks';
import { TranslationProvider } from '../providers';
import { dictionaries, languages } from './data';

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

interface TranslationInteractProps {
  languageId?: string;
}

const TranslationInteract: FC<TranslationInteractProps> = ({ languageId }) => {
  const { languages: languagesList, setLanguage, updateDictionaries } = useTranslation();

  return (
    <div>
      <button
        data-test="update-dictionaries"
        onClick={() => {
          updateDictionaries(newDictionaries);
        }}
      >
        Update dictionaries
      </button>
      <button
        data-test="set-language"
        onClick={() => {
          setLanguage(languageId || '');
        }}
      >
        Set language
      </button>
      <ul>
        {languagesList.map((language) => {
          return (
            <li key={language.id}>
              <button
                data-test={`set-${language.id}`}
                onClick={() => {
                  setLanguage(language.id);
                }}
              >
                {language.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

describe('Translation', () => {
  it('Translation flow without TranslationProvider', () => {
    const translationKey = 'name';

    mount(
      <>
        <TranslationInteract languageId="GER" />
        <p data-test="translation">
          <Translation text={translationKey} />
        </p>
      </>
    );

    cy.get('[data-test="translation"]').should('have.text', translationKey);

    // Update dictionaries:
    cy.get(`[data-test="update-dictionaries"]`).click();

    cy.get('[data-test="translation"]').should('have.text', translationKey);

    // Change language:
    cy.get(`[data-test="set-language"]`).click();

    cy.get('[data-test="translation"]').should('have.text', translationKey);
  });

  it('Translation flow without dictionaries and non existing language', () => {
    const languageId = languages[0].id;

    const translationKey = 'name';

    mount(
      <TranslationProvider dictionaries={{}} languageId={languageId}>
        <TranslationInteract />
        <p data-test="translation">
          <Translation text={translationKey} />
        </p>
      </TranslationProvider>
    );

    cy.get('[data-test="translation"]').should('have.text', translationKey);

    // Change language:
    cy.get(`[data-test="set-language"]`).click();

    cy.get('[data-test="translation"]').should('have.text', translationKey);
  });

  it('Translation flow without substitutions', () => {
    const languageId = languages[0].id;
    const newLanguageId = languages[1].id;

    const translationKey = 'name';

    mount(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <TranslationInteract />
        <p data-test="translation">
          <Translation text={translationKey} />
        </p>
      </TranslationProvider>
    );

    cy.get('[data-test="translation"]').should(
      'have.text',
      dictionaries[languageId].data[translationKey]
    );

    // Update dictionaries:
    cy.get(`[data-test="update-dictionaries"]`).click();

    cy.get('[data-test="translation"]').should('have.text', updatedTranslation);

    // Change language:
    cy.get(`[data-test="set-${newLanguageId}"]`).click();

    cy.get('[data-test="translation"]').should(
      'have.text',
      dictionaries[newLanguageId].data[translationKey]
    );
  });

  it('Translation flow with text as substitution', () => {
    const languageId = languages[0].id;
    const newLanguageId = languages[1].id;

    const translationKey = 'myNameIs';

    const substitute = 'Иван';

    mount(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <TranslationInteract />
        <p data-test="translation">
          <Translation text={translationKey} substitutes={[substitute]} />
        </p>
      </TranslationProvider>
    );

    cy.get('[data-test="translation"]').should('have.text', `Казвам се ${substitute}.`);

    // Change language:
    cy.get(`[data-test="set-${newLanguageId}"]`).click();

    cy.get('[data-test="translation"]').should('have.text', `My name is ${substitute}.`);
  });

  it('Translation flow with jsx as substitution', () => {
    const languageId = languages[0].id;
    const newLanguageId = languages[1].id;

    const translationKey = 'myNameIs';

    const substitute = <b>Иван</b>;

    mount(
      <TranslationProvider dictionaries={dictionaries} languageId={languageId}>
        <TranslationInteract />
        <p data-test="translation">
          <Translation text={translationKey} substitutes={[substitute]} />
        </p>
      </TranslationProvider>
    );

    cy.get('[data-test="translation"]').should('have.html', 'Казвам се <b>Иван</b>.');

    // Change language:
    cy.get(`[data-test="set-${newLanguageId}"]`).click();

    cy.get('[data-test="translation"]').should('have.html', 'My name is <b>Иван</b>.');
  });
});
