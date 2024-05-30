const toSvg = window.htmlToImage.toSvg

export const downloadGraph = async (setCenterGraph) => {
	setCenterGraph((prev) => !prev)

	function filter(node) {
		return node.tagName !== "i"
	}

	let elements = document.getElementsByClassName("react-flow__renderer")[0]

	if (!elements) return

	toSvg(elements, { filter: filter }).then(async (svgContent) => {
		const svgElement = await decodeURIComponent(
			svgContent.replace("data:image/svg+xml;charset=utf-8,", "").trim()
		)

		const htmlContent = `
            <html>
            <head>
            <title>Graph.pdf</title>
            <style>
            @page {
                size: A4 landscape !important;
                margin: 0 !important;
            }
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;   /* Chrome, Safari */
                    color-adjust: exact !important;                 /* Firefox */
                }
            }
            </style>
            </head>
            <body style="margin:60px 32px 32px 32px ">
                ${svgElement}
            </body>
            </html>
        `

		const blob = new Blob([htmlContent], { type: "text/html" })
		const url = URL.createObjectURL(blob)

		const iframe = document.createElement("iframe")
		iframe.style.display = "none"
		iframe.src = url

		iframe.onload = () => {
			iframe.contentWindow.print()
			URL.revokeObjectURL(url)
		}

		document.body.appendChild(iframe)
	})
}
