import { ClientRunParams } from '../types';
import { NodeDescription, Tree } from '@data-story/core';

export interface UpdateTreeParam {
  path: string;
  tree: Tree[];
}

export interface WorkspaceApiClient {
  run(params: ClientRunParams): void;

  getTree: ({ path }) => Promise<Tree[]>
  createTree: ({ path, tree }: { path: string, tree: Tree }) => Promise<Tree[]>;
  updateTree: ({ path, tree }: UpdateTreeParam) => Promise<Tree[]>
  destroyTree: ({ path }: { path: string }) => Promise<void>
  moveTree: ({ path, newPath }: { path: string, newPath: string}) => Promise<Tree[]>

  getNodeDescriptions: ({ path }) => Promise<NodeDescription[]>
}
