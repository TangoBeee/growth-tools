import React from "react"

function Button({ onClick, isPrimary, buttonText, isLoading }) {
	return (
		<div
			className="Polaris-Button"
			onClick={onClick}
			style={{
				display: "flex",
				alignItems: "center",
				borderRadius: "6px",
				height: "36px",
				padding: "16px",
                fontSize: "2rem",
				gap: "8px",
				textWrap: "nowrap",
				pointerEvents: isLoading ? "none" : "",
				...(isPrimary
					? { background: "#6200EA", color: "#ffffff" }
					: {}),
			}}
		>
			{buttonText}
		</div>
	)
}

export default Button
