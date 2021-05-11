import Sleep from '../../../../src/server/nodes/Sleep'
import { when } from "../ServerNodeTester";

it('can run', async () => {
    await when(Sleep).hasParameters({seconds_to_sleep: 0})
		.assertCanRun()
		.finish()
});