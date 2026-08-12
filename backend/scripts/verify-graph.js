import { driver, getSession, verifyConnection, closeDriver } from '../src/database/neo4j.js';

async function run() {
  console.log("Verifying Graph Database...\n");
  
  const isConnected = await verifyConnection();
  if (!isConnected) {
    console.error("GRAPH VERIFICATION FAILED: Cannot connect to CognoDB");
    process.exit(1);
  }

  const session = getSession();
  let passed = true;

  try {
    // 1. Counts
    const counts = await session.run(`
      RETURN 
        size([(d:Developer) | d]) as developers,
        size([(r:Repository) | r]) as repositories,
        size([(t:Technology) | t]) as technologies,
        size([(top:Topic) | top]) as topics,
        size([(o:Organization) | o]) as organizations,
        size([()-[rel]->() | rel]) as relationships
    `);
    const record = counts.records[0];
    console.log("Node Counts:");
    console.log(`Developers:    ${record.get('developers')}`);
    console.log(`Repositories:  ${record.get('repositories')}`);
    console.log(`Technologies:  ${record.get('technologies')}`);
    console.log(`Topics:        ${record.get('topics')}`);
    console.log(`Organizations: ${record.get('organizations')}`);
    console.log(`Relationships: ${record.get('relationships')}`);
    
    if (record.get('developers') === 0 || record.get('relationships') === 0) {
      console.error("\nGraph is empty. Please run seed script.");
      passed = false;
    }

    // 2. Test Developer Query
    console.log("\nTesting Developer Query (octocat)...");
    const devRes = await session.run(`
      MATCH (d:Developer {username: $username})
      OPTIONAL MATCH (d)-[:CONTRIBUTES_TO]->(r:Repository)
      RETURN d.username as username, count(r) as repoCount
    `, { username: 'octocat' });
    
    if (devRes.records.length > 0) {
      console.log(`  Found ${devRes.records[0].get('username')} with ${devRes.records[0].get('repoCount')} connected repos.`);
    } else {
      console.error("  Failed to find 'octocat'.");
      passed = false;
    }

    // 3. Test Related Developers Query
    console.log("\nTesting Related Developers Query (octocat)...");
    const relRes = await session.run(`
      MATCH (d:Developer {username: $username})
      -[:CONTRIBUTES_TO]->(:Repository)
      -[:USES_TECHNOLOGY]->(t:Technology)
      <-[:USES_TECHNOLOGY]-(:Repository)
      <-[:CONTRIBUTES_TO]-(other:Developer)
      WHERE other.username <> $username
      WITH other, collect(DISTINCT t.name) AS sharedTechnologies
      RETURN other.username AS username, size(sharedTechnologies) AS sharedCount
      LIMIT 1
    `, { username: 'octocat' });

    if (relRes.records.length > 0) {
      console.log(`  Found related developer: ${relRes.records[0].get('username')} (shared ${relRes.records[0].get('sharedCount')} tech)`);
    } else {
      console.log("  No related developers found (this might be normal if the graph is small, but ideally we should have some).");
    }

    // 4. Test Path Query
    console.log("\nTesting Path Query (octocat -> javascript)...");
    const pathRes = await session.run(`
      MATCH p = shortestPath(
        (d:Developer {username: $username})-[*1..6]-(t:Technology {normalizedName: $technology})
      )
      RETURN length(p) as pathLength
      LIMIT 1
    `, { username: 'octocat', technology: 'javascript' });
    
    if (pathRes.records.length > 0) {
      console.log(`  Found path of length ${pathRes.records[0].get('pathLength')}.`);
    } else {
      console.log("  No path found between octocat and javascript.");
    }

  } catch (error) {
    console.error("\nError during verification:", error);
    passed = false;
  } finally {
    await session.close();
    await closeDriver();
  }
  
  if (passed) {
    console.log("\nGRAPH VERIFICATION PASSED");
    process.exit(0);
  } else {
    console.log("\nGRAPH VERIFICATION FAILED");
    process.exit(1);
  }
}

run();
