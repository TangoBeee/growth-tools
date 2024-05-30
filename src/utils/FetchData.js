const axios = window.axios

export const fetchJob = async (openApi, setError) => {
	try {
		const response = await axios.post(
			process.env.REACT_APP_BASE_API_URL + "/api/create-dependency-graph",
			{
				apiData: openApi,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		setError("")
		const data = response.data
		return data.jobId
	} catch (error) {
		setError(error.response.data.actionErrors[0])
		return null
	}
}

export const getJobStatus = async (jobId, setError) => {
	try {
		const response = await axios.post(
			process.env.REACT_APP_BASE_API_URL + "/api/dependency-graph-status",
			{
				jobId: jobId,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)

		const data = response.data
		return data
	} catch (error) {
		const err = error.response.data.actionErrors[0]
		if (err && err === "NOT_FOUND") {
			setError("Please wait for a moment...")
			return null
		} else {
			setError(err)
			return err
		}
	}
}
