import React from "react"

const TextArea = ({ value, setValue }) => {

    const onHar1Click = () => {
        setValue("HAR1")
    }

    const onHar2Click = () => {
        setValue("HAR2")
    }

	return (
		<div
			className="Polaris-Card"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				height: "70vh",
				border: "1px solid #E2E1E5",
			}}
		>
			<div
				style={{
					width: "100%",
					padding: "15px",
					fontSize: "18px",
					backgroundColor: "#F6F6F7",
					borderBottom: "1px solid #E2E1E5",
				}}
			>
				Sample files to play around:{" "}
				<span
                    onClick={onHar1Click}
					className="plain-buttons"
					style={{
						cursor: "pointer",
						textDecoration: "underline",
					}}
				>
					HAR01
				</span>
				,{" "}
				<span
                    onClick={onHar2Click}
					className="plain-buttons"
					style={{
						cursor: "pointer",
						textDecoration: "underline",
					}}
				>
					HAR02
				</span>
			</div>

			<textarea
				style={{
					width: "100%",
					height: "100%",
					resize: "none",
					padding: "10px",
					border: "0px",
					outline: "0px",
					fontSize: "16px",
					color: "green",
				}}

                value={value}
                onChange={(e) => setValue(e.target.value)}
			/>
		</div>
	)
}

export default TextArea
