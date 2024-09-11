'use client'

import { DataStory } from '@data-story/ui';
import { core, nodes } from '@data-story/core';
import { MockJSClient } from '../../splash/MockJSClient';

export default () => {
  const { Signal, Comment, Ignore } = nodes;

  const diagram = core.getDiagramBuilder()
    .add({ ...Signal, label: 'DataSource' }, { period: 200, count: 100 })
    .add({ ...Ignore, label: 'Storage' })
    .above('Signal.1').add(Comment, { content: '### Single Diagram 🔥' })
    .get();

  const client = new MockJSClient(diagram);

  return (
    <div className="w-full h-80 border-gray-400 border-4">
      <DataStory
        client={client}
        hideControls={true}
        hideSidebar={true}
        hideActivityBar={true}
      />
    </div>
  );
};
