import type { PanelDefinition } from '@abcnews/scrollyteller';
import { ElectorateID, ELECTORATES, PRESETS } from './constants';
import { determineIfAllocationIsDefinitive } from './utils';
import blockStyles from './components/Block/styles.scss';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';

const SORTED_ELECTORATES = ELECTORATES.sort((a, b) => b.name.length - a.name.length);

export function applyColourToPanels(panels: PanelDefinition<PossiblyEncodedGraphicProps>[]) {
  const electorateIntroductionTracker: { [key: string]: boolean } = {};

  panels.forEach(({ data, nodes }) => {
    const textNodes = nodes.reduce<Node[]>((memo, node) => memo.concat(textNodesUnder(node)), []);

    textNodes.forEach(node => {
      let text = node.textContent || '';

      SORTED_ELECTORATES.forEach(({ name }) => {
        const index = text.indexOf(name);
        if (index > -1 && text[index - 1] !== '|' && text[index + name.length] !== '|') {
          text = text.replace(name, `|||${name}|||`);
        }
      });

      if (text === node.textContent) {
        return;
      }

      const parentEl = node.parentElement;

      if (!parentEl) {
        return;
      }

      text.split('|||').forEach((part, index) => {
        const partTextNode = document.createTextNode(part);

        if (!(index % 2)) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const electorate = ELECTORATES.find(({ name }) => name === part);

        if (!electorate) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const partWrapperNode = document.createElement('span');
        const electorateID = ElectorateID[electorate.id];
        const { allocations, relative } = data as GraphicProps;
        const allocation = allocations && allocations[electorateID];
        const hasDefinitiveAllocation = allocation && determineIfAllocationIsDefinitive(allocation);
        const relativeAllocations = relative && PRESETS[relative]?.allocations;
        const relativeAllocation = relativeAllocations && relativeAllocations[electorateID];

        if (!electorateIntroductionTracker[electorateID]) {
          electorateIntroductionTracker[electorateID] = true;
          partWrapperNode.setAttribute('data-is-first-encounter', '');
        }

        if (allocation) {
          partWrapperNode.setAttribute('data-allocation', allocation);
        }

        if (hasDefinitiveAllocation) {
          partWrapperNode.setAttribute('data-has-definitive-allocation', '');
        }

        if (relativeAllocation) {
          partWrapperNode.setAttribute('data-relative-allocation', relativeAllocation);
        }

        partWrapperNode.setAttribute('data-electorate', electorateID);
        partWrapperNode.className = blockStyles.electorate;
        partWrapperNode.appendChild(partTextNode);
        parentEl.insertBefore(partWrapperNode, node);
      });

      parentEl.removeChild(node);
    });
  });
}

function textNodesUnder(node: Node) {
  const textNodes: Node[] = [];
  const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
  let textNode: Node | null;

  while ((textNode = walk.nextNode())) {
    textNodes.push(textNode);
  }

  return textNodes;
}
