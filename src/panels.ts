import type { PanelDefinition } from '@abcnews/scrollyteller';
import { PRESETS, GroupID, GROUPS } from './constants';
import blockStyles from './components/Block/styles.scss';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';

const SORTED_GROUPS = GROUPS.sort((a, b) => b.name.length - a.name.length);

export function applyColourToPanels(panels: PanelDefinition<PossiblyEncodedGraphicProps>[]) {
  const groupIntroductionTracker: { [key: string]: boolean } = {};

  panels.forEach(({ data, nodes }) => {
    const textNodes = nodes.reduce<Node[]>((memo, node) => memo.concat(textNodesUnder(node)), []);

    textNodes.forEach(node => {
      let text = node.textContent || '';

      SORTED_GROUPS.forEach(({ name }) => {
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

        const group = GROUPS.find(({ name }) => name === part);

        if (!group) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const partWrapperNode = document.createElement('span');
        const groupID = GroupID[group.id];
        const { allocations, relative } = data as GraphicProps;
        const allocation = allocations && allocations[groupID];
        const relativeAllocations = relative && PRESETS[relative]?.allocations;
        const relativeAllocation = relativeAllocations && relativeAllocations[groupID];

        if (!groupIntroductionTracker[groupID]) {
          groupIntroductionTracker[groupID] = true;
          partWrapperNode.setAttribute('data-is-first-encounter', '');
        }

        if (allocation) {
          partWrapperNode.setAttribute('data-allocation', allocation);
        }

        if (relativeAllocation) {
          partWrapperNode.setAttribute('data-relative-allocation', relativeAllocation);
        }

        partWrapperNode.setAttribute('data-group', groupID);
        partWrapperNode.className = blockStyles.group;
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
