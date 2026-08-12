# DevGraph

## What it does
DevGraph is a graph-based application to explore how developers, repositories, and technologies are connected. Instead of traditional table views, it models GitHub data in a graph database to expose insights into developer networks and shared technology stacks.

## Why graph database?
Developer data is naturally connected. A developer contributes to repositories, repositories use technologies and have topics, and developers can belong to organizations. The interesting questions are therefore about paths through these relationships rather than isolated records.

For example, finding developers connected through technologies used by another developer's repositories requires several relationship traversals. In a relational schema this can be represented with multiple join tables and joins. In the graph model, those relationships are directly represented and can be traversed using Cypher.

## Architecture
- **Database**: CognoDB (Neo4j) accessed via official `neo4j-driver`.
- **Backend**: Node.js + Express.js API, organized with services and repositories.
- **Frontend**: React + TypeScript + Vite, using `react-force-graph-2d` for visualization.

## Graph model
```
Developer
│
├── CONTRIBUTES_TO → Repository
│                         │
│                         ├── USES_TECHNOLOGY → Technology
│                         │
│                         └── HAS_TOPIC → Topic
│
└── MEMBER_OF → Organization
```

## Main graph queries
1. **Developer Profile**: Aggregates all repos, tech, topics, and organizations a developer is connected to.
2. **Related Developers**: Multi-hop query that finds other developers who use the same technologies as the searched developer, ranked by the count of shared technologies.
3. **Connection Path**: Bounded `shortestPath` query finding the shortest connection between a given Developer and a given Technology.

## Features
- Search for any developer by GitHub username (pre-seeded).
- View their profile and basic statistics.
- Explore their network interactively in a force-directed graph.
- Discover related developers based on shared technology stacks.
- Connection Finder to plot a path from a developer to a specific technology.

## Local setup
1. Clone the repository.
2. From the `backend` directory, run `npm install`.
3. From the `frontend` directory, run `npm install`.

## CognoDB setup
1. Create a CognoDB database.
2. Obtain the URI, Username, and Password.

## Environment variables
In `backend/.env`:
```
COGNODB_URI=bolt+s://<your-db>.databases.cognodb.com
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-password>
PORT=5000
NODE_ENV=development
GITHUB_TOKEN=<your-github-token-optional>
```

## Seed data
To fetch real GitHub data and load it into the graph database:
```bash
cd backend
npm run db:seed
```
This runs `scripts/fetch-github-data.js` to download data to `data/seed/raw.json`, followed by `scripts/seed-cognodb.js` to populate the database, and `scripts/verify-graph.js` to test queries.

## Run locally
Start the backend API (port 5000):
```bash
cd backend
npm run dev
```

Start the frontend (port 5173):
```bash
cd frontend
npm run dev
```

## Screenshots
*(Add screenshots here)*
- Home
- Developer Explorer
- Network
- Connection Finder

## Design decisions
- Focused heavily on a clean, modern, restrained design using Tailwind CSS.
- Maintained lightweight dependencies (e.g. `react-force-graph-2d` instead of heavy alternatives).
- Implemented `shortestPath` with a bound (1..6) to prevent runaway queries on larger datasets.

## Limitations
- Graph visualization is currently limited to a 1-hop radius from the selected developer to keep the view clean.
- Seed data relies on GitHub rate limits (requires a token for larger seed sets).

## Future improvements
- Extend the visualizer to dynamically fetch more nodes on click.
- Implement more complex similarity algorithms for related developers.
