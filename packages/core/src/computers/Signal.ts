import { ComputerConfig } from '../types/ComputerConfig';
import { sleep } from '../utils/sleep';
import { numberCast } from '../Param/casts/numberCast';
import { multiline } from '../utils/multiline';
import { hjson, json_, num } from '../Param';
import Hjson from '@data-story/hjson';
import { jsEvaluation } from '../Param/evaluations/jsEvaluation';
import { jsExpressionEvaluation } from '../Param/evaluations/jsExpressionEvaluation';
import { jsonEvaluation } from '../Param/evaluations/jsonEvaluation';
import { hjsonEvaluation } from '../Param/evaluations/hjsonEvaluation';

export const Signal: ComputerConfig = {
  name: 'Signal',
  docs: multiline`
    ### Description
    Creates an item every X ms, Y times. Useful for testing.
    The output will look like \`{ id: 1 }, { id: 2 }\` etc.
  `,
  inputs: [],
  outputs: [{
    name: 'output',
    schema: {
      id: 'any',
    }
  }],

  params: [
    num({
      name: 'period',
      help: 'How many ms between each signal?',
      value: 50,
    }),
    num({
      name: 'count',
      help: 'How many times to send the signal?',
      value: 300,
    }),
    hjson({
      name: 'expression',
      label: 'Template expression',
      help: 'Use this field to customize the signal. ${i} is available as a variable.',
      value: Hjson.stringify({id: '${i}'}),
      evaluations: [
        { ...hjsonEvaluation, selected: true },
        jsonEvaluation,
        jsEvaluation,
        jsExpressionEvaluation,
      ]
    })
  ],

  async *run({ input, output, params }) {
    const period = Number(params.period)
    const count = Number(params.count)

    let i = 1;

    while(i <= count) {
      await sleep(period)

      const [ spawned ] = input.pullNew({ i })
      const shaped = spawned.params.expression as Object
      output.push([shaped])

      i++;
      yield;
    }
  },
};
