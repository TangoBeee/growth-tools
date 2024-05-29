export const parseJson = (data, setNodes, setEdges, setError) => {
	const jsonObject = JSON.parse(data)

	if (
		jsonObject == null ||
		!Array.isArray(jsonObject) ||
		jsonObject.length === 0
	) {
		setNodes(null)
		setEdges(null)
		setError("No dependencies found!")
		return
	}

	const edgeType = "default"
	const position = { x: 0, y: 0 }

	const nodes = []
	const edges = []
	let edgeCounter = 1

	jsonObject.forEach((item) => {
		for (const key in item.connections) {
			const connection = item.connections[key]

			for (const edge of connection.edges) {
				const parentNode = edge.method + " " + edge.url
				const currentNode = item.method + " " + item.url

				if (parentNode && currentNode) {
					const sourceNode = nodes.find(
						(node) => node.data.label === parentNode
					)
					const targetNode = nodes.find(
						(node) => node.data.label === currentNode
					)

					if (!sourceNode) {
						nodes.push({
							id: parentNode,
							data: { label: parentNode },
							position,
							style: { width: "fit-content" },
						})
					}

					if (!targetNode) {
						nodes.push({
							id: currentNode,
							data: { label: currentNode },
							position,
							style: { width: "fit-content" },
						})
					}

					const sourceNodeId = sourceNode ? sourceNode.id : parentNode
					const targetNodeId = targetNode
						? targetNode.id
						: currentNode

					if (sourceNodeId && targetNodeId) {
						edges.push({
							id: `e${edgeCounter++}`,
							source: sourceNodeId,
							target: targetNodeId,
							type: edgeType,
							animated: true,
						})
					} else {
						console.error(
							`Skipping edge creation for nodes that don't exist: source '${parentNode}' and target '${currentNode}'`
						)
					}
				}
			}
		}
	})

	setError("")
	setNodes(nodes)
	setEdges(edges)
}
