import { Connection } from 'reactflow';
import { Diagram, LinkGuesser, NodeDescription, AbstractPort, PositionGuesser } from '@data-story/core';
import { DataStoryNode } from '../../Node/DataStoryNode';

import { reactFlowNodeToDiagramNode } from '../../../reactFlowToDiagram';
import { SerializedReactFlowNode } from '../../../SerializedReactFlow';

export const makeNodeAndConnection = (
  diagram: Diagram,
  nodeDescription: NodeDescription
): [DataStoryNode, Connection | null] => {
  const scopedId = (name: string) => {
    const max = diagram.nodes
      .filter((node) => node.type === name)
      .map((node) => node.id)
      .map((id) => id.split('.')[1])
      .map((id) => parseInt(id))
      .reduce((max, id) => Math.max(max, id), 0)

    return max + 1      
  }

  const counter = scopedId(nodeDescription.name)
  const id = `${nodeDescription.name}.${counter}`;

  const flowNode: SerializedReactFlowNode = {
    id,
    position: new PositionGuesser(diagram).guess(nodeDescription),
    data: {
      computer: nodeDescription.name,
      docs: nodeDescription.docs,
      // Ensure two nodes of same type don't share the same params object
      params: structuredClone(nodeDescription.params),
      color: nodeDescription.color,
      label: nodeDescription.label ?? nodeDescription.name,
      inputs: nodeDescription.inputs.map((input: AbstractPort) => {
        return {
          id: `${id}.${input.name}`,
          ...input
        }
      }),
      outputs: nodeDescription.outputs.map((output: AbstractPort) => {
        return {
          id: `${id}.${output.name}`,
          ...output
        }
      }),
    },
    selected: true,
    type: {
      Comment: 'dataStoryCommentNodeComponent',
      //Input: 'dataStoryInputNodeComponent',
      //Output: 'dataStoryOutputNodeComponent',
    }[nodeDescription.name] ?? 'dataStoryNodeComponent',
  }

  const node = reactFlowNodeToDiagramNode(flowNode)

  const link = new LinkGuesser(diagram).guess(node)

  const connection = link ? {
    source: diagram.nodeWithOutputPortId(link.sourcePortId)!.id,
    target: id,
    sourceHandle: link.sourcePortId,
    targetHandle: link.targetPortId,
  } : null;

  return [flowNode, connection]
}

// const connection: {
//   id: string;
//   sourceHandle: string | undefined;
//   targetHandle: string | undefined;
//   source: string;
//   target: string;
// } | null