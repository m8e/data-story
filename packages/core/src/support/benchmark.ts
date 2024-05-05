import { Application } from '../Application';
import { DiagramBuilder } from '../DiagramBuilder';
import { Executor } from '../Executor';
import { ExecutorFactory } from '../ExecutorFactory';
import { InMemoryStorage } from '../InMemoryStorage';
import { Create, Ignore, CreateProperties } from '../computers';
import { coreNodeProvider } from '../coreNodeProvider';

(async () => {
  const itemCount = 1_000_000

  const data: {id: number}[] = []

  for (let i = 0; i < itemCount; i++) {
    data.push({id: i})
  }

  const app = new Application();

  app.register([
    coreNodeProvider,
  ]);

  app.boot();

  const diagram = new DiagramBuilder()
    .add(Create, {json: JSON.stringify(data)})
    .add(CreateProperties)
    .add(Ignore)
    .get()

  const executor = ExecutorFactory.create(
    diagram,
    app.registry,
    new InMemoryStorage()
  )

  const startTime = Date.now()

  const execution = executor.execute()

  try {
    for await(const update of execution) {}

    const endTime = Date.now()

    console.log(`Processing ${itemCount} items. Execution time in milliseconds: `, endTime - startTime)
  } catch(error: any) {
    console.log('Error: ', error.message)
    throw error
  }
})()
