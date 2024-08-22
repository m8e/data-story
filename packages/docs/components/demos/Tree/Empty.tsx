'use client'

import { DataStory } from '@data-story/ui';
import { Application, core, coreNodeProvider, multiline } from '@data-story/core';
import { WorkspacesApi } from '@data-story/ui/dist/src/components/DataStory/clients/WorkspacesApi';

export default () => {
  const clientv2 = {
    workspacesApi: {
      getTree: () => new Promise((resolve, reject) => {
        resolve(null);
      })
    } as unknown as WorkspacesApi
  }

  const app = new Application();
  app.register(coreNodeProvider);
  app.boot();

  return (
    <div className="w-full h-80 border-gray-400 border-4">
      <DataStory
        client={clientv2}
        server={{ type: 'JS', app }}
        onInitialize={(options) => options.run()}
        hideControls={true}
      />
    </div>
  );
};
