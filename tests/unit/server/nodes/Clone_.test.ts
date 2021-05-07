import Clone_ from '../../../../src/server/nodes/Clone_'
import { when } from "../ServerNodeTester";

// it.skip('makes ten clones by default', async () => {
//     await when(Clone_).hasInput(['a feature'])
// 		.assertCanRun()
// 		.assertOutputCount(11)
// 		.finish()
// });

it.skip('allows configuration of number of clones', async () => {
    await when(Clone_).hasInput([1337]).and().parameters({number_of_clones: 1})
		.assertCanRun()
		.assertOutput([1337, 1337])
		.finish()
});