import { when } from '@data-story/core/dist/support/computerTester/ComputerTester';
import { ReadFiles } from './ReadFiles';

it.todo('does something', async () => {
  await when(ReadFiles)
    .hasDefaultParams()
    .getsInput([{i: 1}, {i: 2}])
    .doRun()
    .expectOutput([{i: 1}, {i: 2}])
    .getsInput([{i: 3}, {i: 4}])
    .doRun()
    .expectOutput([{i: 1}, {i: 2}, {i: 3}, , {i: 4}])
    .ok()
})
