import { getSession } from '../database/neo4j.js';
import { normalizeUsername } from '../utils/normalize.js';

class DeveloperRepository {
  async developerExists(username) {
    const session = getSession();
    try {
      const result = await session.run(
        'MATCH (d:Developer {username: $username}) RETURN d LIMIT 1',
        { username: normalizeUsername(username) }
      );
      return result.records.length > 0;
    } finally {
      await session.close();
    }
  }

  async getDeveloperProfile(username) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (d:Developer {username: $username})
        OPTIONAL MATCH (d)-[:CONTRIBUTES_TO]->(r:Repository)
        OPTIONAL MATCH (r)-[:USES_TECHNOLOGY]->(tech:Technology)
        OPTIONAL MATCH (r)-[:HAS_TOPIC]->(topic:Topic)
        OPTIONAL MATCH (d)-[:MEMBER_OF]->(o:Organization)
        RETURN d AS developer,
               collect(DISTINCT r) AS repositories,
               collect(DISTINCT tech) AS technologies,
               collect(DISTINCT topic) AS topics,
               collect(DISTINCT o) AS organizations
      `, { username: normalizeUsername(username) });

      if (result.records.length === 0) return null;

      const record = result.records[0];
      return {
        developer: record.get('developer').properties,
        repositories: record.get('repositories').map(node => node.properties),
        technologies: record.get('technologies').map(node => node.properties),
        topics: record.get('topics').map(node => node.properties),
        organizations: record.get('organizations').map(node => node.properties)
      };
    } finally {
      await session.close();
    }
  }

  async getDeveloperNetwork(username) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (d:Developer {username: $username})
        OPTIONAL MATCH (d)-[r1:CONTRIBUTES_TO]->(repo:Repository)
        OPTIONAL MATCH (repo)-[r2:USES_TECHNOLOGY]->(tech:Technology)
        OPTIONAL MATCH (repo)-[r3:HAS_TOPIC]->(topic:Topic)
        OPTIONAL MATCH (d)-[r4:MEMBER_OF]->(org:Organization)
        OPTIONAL MATCH (tech)<-[r5:USES_TECHNOLOGY]-(otherRepo:Repository)<-[r6:CONTRIBUTES_TO]-(other:Developer)
        WHERE other.username <> $username
        RETURN d, repo, tech, topic, org, r1, r2, r3, r4,
               other, otherRepo, r5, r6
        LIMIT 200
      `, { username: normalizeUsername(username) });
      return result.records;
    } finally {
      await session.close();
    }
  }
}

export default new DeveloperRepository();
