import { Application, core, nodes } from '@data-story/core';
import { MessageHandler } from '../MessageHandler';
import WebSocket from 'ws';

export type GetTreeMessage = {
  id: string,
  awaited: boolean,
  type: 'getTree',
  path: string,
}

export const getTree: MessageHandler<GetTreeMessage> = async(
  ws: WebSocket,
  data: GetTreeMessage,
  app: Application
) => {
  const tree = await app.getTreeManager().getTree({
    path: data.path,
  });

  const response = {
    id: data.id,
    awaited: data.awaited,
    type: 'GetTreeResponse',
    tree: [tree],
  }

  ws.send(JSON.stringify(response))
}
