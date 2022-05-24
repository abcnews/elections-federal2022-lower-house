import 'regenerator-runtime/runtime';
import acto from '@abcnews/alternating-case-to-object';
import { getTier, TIERS, whenOdysseyLoaded } from '@abcnews/env-utils';
import { getMountValue, isMount, selectMounts } from '@abcnews/mount-utils';
import type { ScrollytellerDefinition } from '@abcnews/scrollyteller';
import { loadScrollyteller } from '@abcnews/scrollyteller';
import React from 'react';
import { render } from 'react-dom';
import './lib/theme.scss';
import { applyColourToPanels } from './lib/panels';
import { alternatingCaseToGraphicProps, decoders } from './lib/utils';
import Block from './components/Block';
import type { Mode } from './components/Card/constants';
import Card from './components/Card';
import graphicStyles from './components/Graphic/styles.scss';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';
import Graphic from './components/Graphic';
import Illustration, { IllustrationName } from './components/Illustration';

export type OdysseySchedulerClient = {
  hasChanged: boolean;
  fixedHeight: number;
};

export type OdysseySchedulerSubscriber = (client: OdysseySchedulerClient) => void;

export type OdysseyAPI = {
  scheduler: {
    subscribe: (subscriber: OdysseySchedulerSubscriber) => void;
    unsubscribe: (subscriber: OdysseySchedulerSubscriber) => void;
  };
  utils: {
    dom: {
      detach: (el: Element) => void;
    };
  };
};

const whenScrollytellersLoaded = new Promise((resolve, reject) =>
  whenOdysseyLoaded.then(odyssey => {
    const cardsMounts = selectMounts('lhcard');
    const uniqueNames = selectMounts('scrollytellerNAME', { markAsUsed: false })
      .map(mountEl => (getMountValue(mountEl).match(/NAME([a-z]+)/) || [])[1])
      .filter(name => typeof name === 'string')
      .filter((name, index, names) => names.indexOf(name) === index);
    const scrollytellerDefinitions: ScrollytellerDefinition<PossiblyEncodedGraphicProps>[] = [];

    for (const name of uniqueNames) {
      let scrollytellerDefinition: ScrollytellerDefinition<PossiblyEncodedGraphicProps>;

      try {
        scrollytellerDefinition = loadScrollyteller(name, 'u-full');

        // Decode encoded props
        scrollytellerDefinition.panels.forEach(({ data }) => {
          Object.keys(decoders).forEach(key => {
            data[key] = decoders[key]((data[key] as string) || '');
          });

          if (typeof data.layout === 'number') {
            data.layout = String(data.layout);
          }
        });

        // Upgrade scrollyteller' content to show coloured electorate & party names
        applyColourToPanels(scrollytellerDefinition.panels);
      } catch (err) {
        return reject(err);
      }

      // Keep the DOM tidy.
      if (scrollytellerDefinition && scrollytellerDefinition.mountNode) {
        while (isMount(scrollytellerDefinition.mountNode.nextElementSibling)) {
          (odyssey as OdysseyAPI).utils.dom.detach(scrollytellerDefinition.mountNode.nextElementSibling);
        }
      }

      scrollytellerDefinitions.push(scrollytellerDefinition);
    }

    // Upgrade all scrollytellers' content to show live results
    cardsMounts.forEach(mount => {
      const { electorate, mode, hide } = acto(getMountValue(mount));

      if (typeof electorate !== 'string' || (typeof hide === 'boolean' && hide)) {
        return (((mount as unknown) as HTMLElement).style.display = 'none');
      }

      render(<Card electorateID={electorate.toUpperCase()} mode={mode as Mode | undefined} />, mount);
    });

    // Return scrollyteller definitions
    resolve(scrollytellerDefinitions);
  })
);

whenScrollytellersLoaded.then(scrollytellerDefinitions => {
  (scrollytellerDefinitions as ScrollytellerDefinition<GraphicProps>[]).forEach(scrollytellerDefinition =>
    render(<Block panels={scrollytellerDefinition.panels} />, scrollytellerDefinition.mountNode)
  );
});

whenOdysseyLoaded.then(() => {
  // Render illustrations

  const illustrationMounts = selectMounts('lhillustration');

  illustrationMounts.forEach(mount => {
    const parentEl = mount.parentElement;

    if (!parentEl) {
      return;
    }

    const { name } = acto(getMountValue(mount)) as { name: IllustrationName };

    if (name && !Object.values(IllustrationName).includes(name)) {
      return;
    }

    const titleEl = parentEl.querySelector('h1');

    if (titleEl && titleEl.parentElement === parentEl) {
      mount.removeAttribute('class');
      parentEl.insertBefore(mount, titleEl);
    }

    render(<Illustration name={name} />, mount);
  });

  // Render standalone graphics (moving those designated as replacement Block media)

  const graphicMounts = selectMounts('lhgraphic');

  graphicMounts.forEach(mount => {
    const graphicProps = alternatingCaseToGraphicProps(getMountValue(mount)) as GraphicProps;
    const parentElement = mount.parentElement;

    if (parentElement && parentElement.className.indexOf('Block-content') > -1) {
      const blockElement = parentElement.parentElement;

      if (blockElement && blockElement.className.indexOf('Block') > -1) {
        let blockMediaElement = blockElement.querySelector('.Block-media');

        if (blockMediaElement) {
          blockMediaElement.innerHTML = '';
        } else {
          blockMediaElement = document.createElement('div');
          blockMediaElement.className = 'Block-media';
          blockElement.insertBefore(blockMediaElement, blockElement.firstElementChild as Element);
        }

        const container = document.createElement('div');

        container.className = graphicStyles.blockMediaContainer;
        blockMediaElement.classList.add('is-fixed');
        container.appendChild(mount);
        blockMediaElement.appendChild(container);
        blockElement.removeChild(parentElement);

        const firstBlockContent = blockElement.querySelector('.Block-content');

        if (firstBlockContent) {
          firstBlockContent.classList.add(graphicStyles.firstBlockContent);
        }
      }
    } else {
      mount.classList.add('u-pull');
    }

    render(<Graphic {...graphicProps} />, mount);
  });

  // Fallback exporter

  if (getTier() === TIERS.PREVIEW) {
    const titleEl = document.querySelector('.Header h1');

    if (titleEl) {
      (titleEl as HTMLElement).style.cursor = 'copy';
      titleEl.addEventListener('click', () => {
        import(/* webpackChunkName: "fallbacks" */ './fallbacks').then(module => module.default(titleEl, null));
      });
    }
  }
});
