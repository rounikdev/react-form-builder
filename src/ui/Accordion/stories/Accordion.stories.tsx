import { Meta, Story } from '@storybook/react';
import { FC, useState } from 'react';

import { useMount, useUnmount } from '@rounik/react-custom-hooks';

import { Image } from '@ui';

import { Accordion } from '../Accordion';
import { AccordionGroup } from '../AccordionGroup';
import { RenderHeaderArgs } from '../types';

import styles from './AccordionStories.scss';

export default {
  title: 'Components/Accordion'
} as Meta;

const Content: FC<{ id: string }> = ({ id }) => {
  useMount(() => {
    console.log('Content mount', id);
  });

  useUnmount(() => {
    console.log('Content un-mount', id);
  });

  return (
    <div data-test={`${id}-component`}>
      <Image
        alt="cat"
        className={styles.Image}
        dataTest={`${id}-cat`}
        // eslint-disable-next-line max-len
        src="https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/other/cat_relaxing_on_patio_other/1800x1200_cat_relaxing_on_patio_other.jpg"
      />
      <p className={styles.Text}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui deleniti dolorem laboriosam
        sunt totam officiis, soluta ad sed optio, rem harum cumque quibusdam. Repellendus facere
        dolores harum eos saepe corporis. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        Sit obcaecati magni sapiente consequatur adipisci doloremque, quod numquam iure assumenda
        quia. Fuga, sapiente? Labore officiis atque temporibus aperiam iusto voluptatem unde? Lorem
        ipsum dolor, sit amet consectetur adipisicing elit. Consectetur aut beatae placeat itaque
        neque modi molestiae nulla rem dolore. Dolor nihil beatae hic at illum expedita error
        consequatur nobis eaque. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui
        deleniti dolorem laboriosam sunt totam officiis, soluta ad sed optio, rem harum cumque
        quibusdam. Repellendus facere dolores harum eos saepe corporis. Lorem ipsum dolor, sit amet
        consectetur adipisicing elit. Sit obcaecati magni sapiente consequatur adipisci doloremque,
        quod numquam iure assumenda quia.
      </p>
    </div>
  );
};

const renderHeader =
  (label: string) =>
  // eslint-disable-next-line react/display-name
  ({ close, disabled, id, isOpen, open }: RenderHeaderArgs) => {
    return (
      <div className={[styles.Header, isOpen && styles.Open].filter(Boolean).join(' ')}>
        <button
          aria-controls={`${id}-content`}
          aria-expanded={isOpen}
          data-test={`${id}-header`}
          disabled={disabled}
          className={styles.HeaderButton}
          id={`${id}-header`}
          onClick={() => {
            if (isOpen) {
              close();
            } else {
              open();
            }
          }}
          onKeyPress={() => {
            if (isOpen) {
              close();
            } else {
              open();
            }
          }}
        >
          {label}
        </button>
      </div>
    );
  };

const Template: Story<FC> = () => {
  const [mountBears, setMountBears] = useState(true);
  const [openedCats, setOpenedCats] = useState(true);

  return (
    // TODO: get StrictMode back when useUpdateOnlySafe is ready
    <div>
      <div className={styles.Container}>
        <button
          data-test="unmount-bears"
          onClick={() => {
            setMountBears(false);
          }}
        >
          Unmount bears
        </button>
        <button
          data-test="opened-cats"
          onClick={() => {
            setOpenedCats((prevState) => !prevState);
          }}
        >
          {openedCats ? 'Close Cats!' : 'Open Cats!'}
        </button>
        <AccordionGroup maxOpened={1}>
          <Accordion dataTest="empty" id="empty" renderHeader={renderHeader('Empty')}>
            {[].map(() => (
              <div data-test="empty" key="a">
                hi
              </div>
            ))}
          </Accordion>
          <Accordion
            dataTest="cats"
            id="cats"
            keepMounted
            onChange={({ opened }) => {
              setOpenedCats(opened);
            }}
            opened={openedCats}
            renderHeader={renderHeader('Cats')}
          >
            <Content id="cats-content" />
          </Accordion>
          <Accordion dataTest="dogs" id="dogs" keepMounted renderHeader={renderHeader('Dogs')}>
            <Content id="dogs-content" />
          </Accordion>
          {mountBears ? (
            <Accordion dataTest="bears" disabled id="bears" renderHeader={renderHeader('Bears')}>
              <Content id="bears-content" />
            </Accordion>
          ) : null}
          <Accordion
            dataTest="dolphins"
            excludeFromGroup
            id="dolphins"
            renderHeader={renderHeader('Dolphins')}
          >
            <Content id="dolphins-content" />
          </Accordion>
        </AccordionGroup>
        <Accordion
          dataTest="elephants"
          id="elephants"
          keepMounted
          renderHeader={renderHeader('Elephants - outside of a group')}
        >
          <Content id="elephants-content" />
        </Accordion>
      </div>
    </div>
  );
};

export const Basic = Template.bind({});
