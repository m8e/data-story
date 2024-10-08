import { Tree } from '@data-story/core';
import { Activity } from '../types';
import { ConfigIcon } from '../icons/configIcon';
import { ExplorerIcon } from '../icons/explorer';

export const LocalStorageKey = 'data-story-tree';

export const findFirstFileNode = (tree: Tree[]): Tree | null => {
  for(const node of tree) {
    if (node.type === 'file') return node;

    if (node.type === 'folder' && node.children) {
      const found = findFirstFileNode(node.children);
      if (found) return found;
    }
  }
  return null;
}

export const findNodeById = (tree: Tree[], id: string): Tree | null => {
  for(const node of tree) {
    if (node.id === id) {
      return node;
    }

    if (node.type === 'folder' && node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }

  return null;
};

export const isSingleFile = (trees: Tree[]): boolean => {
  if (trees.length === 1 && trees[0].type === 'file') return true;
  return false;
}

export const ActivityGroups: Activity[] = [
  { id: 'explorer', name: 'Explorer', icon: ExplorerIcon, position: 'top' },
  { id: 'settings', name: 'Settings', icon: ConfigIcon, position: 'top' },
];

// for debugging.
export const areEqual = (prevProps, nextProps) => {
  Object.entries(nextProps).forEach(([key, val]) => {
    if (prevProps[key] !== val) {
      console.log(`Prop '${key}' changed DataStory`);
      console.log('prev:', prevProps[key]);
      console.log('next:', val);
    }
  });

  // Returning false means the component will always re-render, primarily for debugging purposes.
  return false;
}
