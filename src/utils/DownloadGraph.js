const toSvg = window.htmlToImage.toSvg

export const downloadGraph = async (setCenterGraph) => {
    setCenterGraph((prev) => !prev)

	function filter(node) {
		return node.tagName !== "i"
	}

	let elements = document.getElementsByClassName("react-flow__renderer")[0]

    if(!elements) return;

	toSvg(elements, { filter: filter }).then(async (svgContent) => {
		const svgElement = await decodeURIComponent(
			svgContent.replace("data:image/svg+xml;charset=utf-8,", "").trim()
		)

		const newWindow = window.open()

		newWindow.document.write(`
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
                <script>
                window.print();
                window.close();
                </script>
            </body>
            </html>
        `)
	})
}
