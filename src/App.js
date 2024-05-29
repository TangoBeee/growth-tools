import React, { useRef, useState } from "react"
import { AddClass, UseExternalScripts } from "./utils/useExternalScripts"
import Button from "./components/Button"
import TextArea from "./components/TextArea"
import Graph from "./components/Graph"
import { parseJson } from "./utils/Parser"
import { validate } from "./utils/OpenAPIValidator"
import { fetchJob, getJobStatus } from "./utils/FetchData"
import { downloadGraph } from "./utils/DownloadGraph"

const App = () => {
	UseExternalScripts(
		"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
	)

	UseExternalScripts(
		"https://d1hvi6xs55woen.cloudfront.net/website-assets/polaris.css"
	)

	AddClass(
		".plain-buttons {color: #2B6ECA;} @media screen and (max-width: 950px) { .graph-content { flex-direction: column; } }"
	)

	// Loader class (animation and styling)
	AddClass(
		".loader { border: 16px solid #f3f3f3; border-radius: 50%; border-top: 16px solid #6200EA; width: 84px; height: 84px; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite; } @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"
	)

	const [openAPI, setOpenAPI] = useState("")
	const [nodes, setNodes] = useState(null)
	const [edges, setEdges] = useState(null)
	const [error, setError] = useState("Your dependency graph will shown here!")
	const [isLoading, setIsLoading] = useState(false)
	const [centerGraph, setCenterGraph] = useState(false)

	const inputRef = useRef(null)

	const onImportClick = () => {
		inputRef.current?.click()
	}

	const handleFileUpload = (event) => {
		const file = event.target.files[0]
		const reader = new FileReader()

		reader.readAsText(file)
		reader.onload = () => {
			setOpenAPI(reader.result)
		}
		reader.onerror = () => {
			setOpenAPI(reader.error)
		}
	}

	const onExportClick = () => {
		downloadGraph(setCenterGraph)
	}

	const onSubmitHandler = async () => {
		if (isLoading) return
		setIsLoading(true)
		setNodes(null)
		setEdges(null)
		setError("Your dependency graph will shown here!")

		if (!openAPI || openAPI.length === 0) {
			setIsLoading(false)
			return
		}

		const validateOpenAPI = await validate(openAPI)

		if (validateOpenAPI.error) {
			setError(validateOpenAPI.error)
			setIsLoading(false)
			return
		}

		const jobId = await fetchJob(validateOpenAPI, setError)
		if (jobId == null && !error) {
			setError("Something went wrong!")
			setIsLoading(false)
			return
		}

		let data = undefined
		let i = 0
		const jobInterval = setInterval(async () => {
			i++
			data = await getJobStatus(jobId, setError)

			if (data === "Invalid schema") {
				setError(data)
				clearInterval(jobInterval)
				setIsLoading(false)
				return
			} else if (data === "NOT_FOUND") {
				setError(data)
				clearInterval(jobInterval)
				setIsLoading(false)
				return
			}

			if (data && data.dependencyGraph) {
				setError(null)
				clearInterval(jobInterval)
				parseJson(data.dependencyGraph, setNodes, setEdges, setError)
				setIsLoading(false)
				return
			}

			if (i >= 6) {
				setError("Graph Not Found")
				clearInterval(jobInterval)
				setIsLoading(false)
				return
			}
		}, 5000)
	}

	return (
		<div>
			<div>
				<h1
					style={{
						fontFamily: "4.2rem",
						fontWeight: 600,
					}}
				>
					Dependency graph
				</h1>
			</div>

			<div
				className="Polaris-Card"
				style={{
					display: "flex",
					flexDirection: "column",
					padding: "0px",
					width: "100%",
					maxWidth: "100%",
					fontSize: "16px",
					borderRadius: "8px",
					border: "1px solid #E2E1E5",
				}}
			>
				<div
					className="graph-content"
					style={{
						display: "flex",
						gap: "20px",
						justifyContent: "space-between",
						padding: "30px",
					}}
				>
					<div style={{ flex: 4 }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "-15px",
							}}
						>
							<h4
								style={{
									fontWeight: "400",
									fontSize: "18px",
								}}
							>
								OpenAPI
							</h4>

							<p
								onClick={onImportClick}
								className="plain-buttons"
								style={{
									cursor: "pointer",
									fontSize: "18px",
								}}
							>
								<input
									accept=".json, .yaml, .yml, .txt"
									type="file"
									ref={inputRef}
									onChange={handleFileUpload}
									hidden
								/>
								Import
							</p>
						</div>

						<TextArea value={openAPI} setValue={setOpenAPI} />
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							gap: "15px",
						}}
					>
						<Button
							onClick={onSubmitHandler}
							isPrimary={true}
							buttonText={"Generate"}
							isLoading={isLoading}
						/>
						<Button isPrimary={false} buttonText={"Share tool"} />
					</div>

					<div style={{ flex: 4 }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "-15px",
							}}
						>
							<h4
								style={{
									fontWeight: "400",
									fontSize: "18px",
								}}
							>
								Dependency Graph
							</h4>

							<p
								onClick={onExportClick}
								className="plain-buttons"
								style={{
									cursor: "pointer",
									fontSize: "18px",
								}}
							>
								Export
							</p>
						</div>
						<Graph
							nodes={nodes}
							edges={edges}
							error={error}
							centerGraph={centerGraph}
							isLoading={isLoading}
						/>
					</div>
				</div>

				<div
					className="Polaris-Card"
					style={{
						background: "#FAFAFB",
						padding: "20px",
						width: "100%",
					}}
				>
					<img
						src="https://akto-setup.s3.amazonaws.com/templates/128x128.png"
						alt="Akto.io"
						style={{ height: "24px" }}
					/>
				</div>
			</div>
		</div>
	)
}

export default App
