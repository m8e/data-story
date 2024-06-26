import WebSocket from 'ws';
import { onMessage } from './onMessage';
import { Application, InMemoryStorage } from '@data-story/core';

interface SocketServerOptions {
  app: Application;
  port?: number;
}

export class SocketServer {
  private app: any; // replace 'any' with your app type
  private port: number;
  private wsServer?: WebSocket.Server;

  constructor({ app, port = 3100 }: SocketServerOptions) {
    this.app = app;
    this.port = port;
  }

  start() {
    this.wsServer = new WebSocket.Server({ port: this.port });

    this.wsServer.on('connection', (ws) => {
      const storage = new InMemoryStorage();
      ws.on('message', (msg: string) => onMessage(ws, msg, this.app, storage));

      ws.on('close', () => {
        console.log('Client disconnected 😢');
      });

      ws.on('error', (error) => {
        console.log('Error 😱', error);
      });

      console.log('Client connected 💓');
    });
  }
}
