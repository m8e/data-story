import { DataStory } from '@data-story/ui'
import '@data-story/ui/dist/data-story.css';
import { coreNodeProvider, Application, DiagramBuilder, multiline } from '@data-story/core';
import { ConsoleLog, Map, Signal, Fake, Comment } from '@data-story/core/dist/computers';

export default () => {
  const app = new Application();

  app.register([
    coreNodeProvider
  ]);

  app.boot();

  // HubSpot Example
  const diagram = new DiagramBuilder() 
    .addFake({
      label: 'Products',
      outputs: ['all', 'error']
    })
    .add(Map)
    .addFake({
      label: 'OpenAI-GPT',
      inputs: ['prompt'],
      outputs: ['suggestions', 'costs', 'errors']
    })
    .addFake({
      label: 'Products.update',
      inputs: ['input'],
    })
    .below('Fake.3').addFake({
      label: 'Log',
      inputs: ['input'],
    })
    .linkByLabel('OpenAI-GPT.costs', 'Log.input')


    .above('Fake.1').add(Comment, { content: multiline`
      ### OpenAI APIs without code 💡
      Example: Improve SEO with GPT-X

      [prev](/pitchdeck/1) [next](/pitchdeck/2)
    `})
    
    .jiggle()
    
    .get()

  return (
    <div className="w-full" style={{ height: '100vh' }}>
      <DataStory
        // server={{ type: 'SOCKET', url: 'ws://localhost:3100' }}
        callback={(options: any) => setTimeout(options.run, 100)}
        server={{ type: 'JS', app }}
        diagram={diagram}
      />
    </div>   
  );
};