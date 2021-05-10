import ServerNode from "../ServerNode";
import NodeParameter from "../../core/NodeParameter";
import Feature from "../../core/Feature";

export default class OutputProvider extends ServerNode {
	constructor(options = {}) {
		super({
			// Defaults
			name: 'OutputProvider',
			summary: 'Provides output ports from JSON',
			category: 'Workflow',
			editableOutPorts: true,
			// Explicitly configured
			...options,
		})
	}

    async run() {
        const outputs = this.getParameterValue('outputs')
		for(const [key, value] of Object.entries(outputs)) {
			this.output((value as any[]).map(v => new Feature(v)), key)
		}
    }
	
	getParameters() {
		return [
			...super.getParameters(),
            NodeParameter.js('outputs').withValue({
				Input: [1337],
			}),
		]
	}
}