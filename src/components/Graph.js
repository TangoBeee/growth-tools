import React, { useCallback, useEffect } from "react"
import ReactFlow, {
	Background,
	Controls,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import Loading from "./Loading"

const elk = new window.ELK()

const useLayoutedElements = (centerGraph) => {
	const { getNodes, setNodes, getEdges, fitView } = useReactFlow()
	const defaultOptions = {
		"elk.algorithm": "layered",
		"elk.layered.spacing.nodeNodeBetweenLayers": 100,
		"elk.spacing.nodeNode": 80,
	}

	const reactFlow = useReactFlow()
	useEffect(() => {
		reactFlow.fitView();
	}, [centerGraph])

	const getLayoutedElements = useCallback((options) => {
		const layoutOptions = { ...defaultOptions, ...options }
		const graph = {
			id: "root",
			layoutOptions: layoutOptions,
			children: getNodes(),
			edges: getEdges(),
		}

		elk.layout(graph).then(({ children }) => {
			children.forEach((node) => {
				node.position = { x: node.x, y: node.y }
			})

			setNodes(children)
			window.requestAnimationFrame(() => {
				fitView()
			})
		})
	})

	return { getLayoutedElements }
}

const LayoutFlow = ({ initialNodes, initialEdges, centerGraph }) => {
	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const [edges, , onEdgesChange] = useEdgesState(initialEdges)
	const { getLayoutedElements } = useLayoutedElements(centerGraph)

	const proOptions = { hideAttribution: true }

	useEffect(() => {
		setTimeout(() => {
			getLayoutedElements({
				"elk.algorithm": "layered",
				"elk.direction": "RIGHT",
			})
		}, 1)
	}, [])

	return (
		<ReactFlow
			proOptions={proOptions}
			nodes={nodes}
			edges={edges}
			minZoom={0.001}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			snapToGrid={true}
			fitView={true}
		>
			<Controls />
			<Background />
		</ReactFlow>
	)
}

const Graph = ({ nodes, edges, error, centerGraph, isLoading }) => {
	return (
		<div
			className="Polaris-Card"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "70vh",
				border: "1px solid #E2E1E5",
			}}
		>
			{" "}
			{isLoading ? (
				<Loading />
			) : !nodes || !edges ? (
				error
			) : (
				<ReactFlowProvider>
					<LayoutFlow
						initialNodes={nodes}
						initialEdges={edges}
						centerGraph={centerGraph}
					/>
				</ReactFlowProvider>
			)}
		</div>
	)
}

export default Graph
