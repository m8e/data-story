import WebSocket from 'ws';
import { RunMessage } from '../messages/RunMessage';
import { MessageHandler } from '../MessageHandler';
import { OutputController, ExecutorFactory, Application, Diagram, Executor, ExecutionResult, ExecutionFailure, InMemoryStorage } from '@data-story/core';

export const run: MessageHandler<RunMessage> = async (
  ws: WebSocket,
  data: RunMessage,
  app: Application,
  storage: InMemoryStorage
) => {
  // const diagram = DiagramFactory.fromReactFlow(
  //   data.reactFlow
  // )

  storage.itemsMap.clear();
  // TODO: Implement deserialize method
  const diagram = new Diagram({
    nodes: data.diagram.nodes,
    links: data.diagram.links,
  })

  const outputController = new OutputController(
    data.observeInputPort,
    ws.send.bind(ws)
  );

  const executor = ExecutorFactory.create(
    diagram,
    app.registry,
    storage,
    outputController
  )

  const execution = executor.execute()

  try {
    for await(const update of execution) {
      ws.send(JSON.stringify(update))
    }

    ws.send(
      JSON.stringify(
        new ExecutionResult()
      )
    )
  } catch(error: any) {
    if (ws.readyState === WebSocket.OPEN) {
      console.log('Sending ExecutionFailure to client')
      console.log(error)

      const failure: ExecutionFailure = {
        type: 'ExecutionFailure',
        message: error.message,
        history: executor.memory.getHistory()
      }

      ws.send(JSON.stringify(failure))
    } else {
      console.log('WebSocket connection closed, unable to send ExecutionFailure')
    }

    return;
  }
}
