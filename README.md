# Dependency Graph

A web app that converts OpenAPI schema (JSON and YAML) to a Dependency Graph.


## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/akto-api-security/growth-tools/tree/tool/dependency-graph
cd dependency-graph
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory with the following content:

```
REACT_APP_BASE_API_URL=localhost:<PORT>
REACT_APP_OPENAPI_VALIDATOR_BASE_URL=localhost:<PORT>
```

This environment variable specifies the base URL for the [API](https://github.com/akto-api-security/akto/).

### 4. Run the Project

```bash
npm start
```

The project will be running at http://localhost:3000 by default.

### 5. Enjoy!
