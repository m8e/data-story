import WebSocket from 'ws';
import { describe, run } from './messageHandlers'
import { MessageHandler } from './MessageHandler';
import { Application, NullStorage } from '@data-story/core';
import { getItems } from './messageHandlers/getItems';

export const onMessage = async (
  ws: WebSocket,
  message: string,
  app: Application,
  storage: NullStorage
) => {
  const parsed: { type: string } & Record<string, any> = JSON.parse(message);
  // console.log(parsed);

  const handlers: Record<string, MessageHandler<any>> = {
    describe,
    run,
    getItems
  }

  const handler = handlers[parsed.type];
  if(!handler) throw('Unknown message type (server): ' + parsed.type)
  await handler(ws, parsed, app, storage)
}
