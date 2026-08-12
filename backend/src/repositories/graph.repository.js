import neo4j from 'neo4j-driver';
import { getSession } from '../database/neo4j.js';
import { normalizeUsername, normalizeName, toNumber } from '../utils/normalize.js';

// Allowed node types — never interpolate user input directly into Cypher labels
const ALLOWED_NODE_TYPES = new Set(['Developer', 'Repository', 'Technology', 'Topic', 'Organization']);

class GraphRepository {
  /**
   * Return the immediate neighborhood of a Developer node:
   * their repositories, technologies, topics, organizations.
   */
  async expandDeveloper(username, limit = 20) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (d:Developer {username: $username})
        OPTIONAL MATCH (d)-[r1:CONTRIBUTES_TO]->(repo:Repository)
        OPTIONAL MATCH (repo)-[r2:USES_TECHNOLOGY]->(tech:Technology)
        OPTIONAL MATCH (repo)-[r3:HAS_TOPIC]->(topic:Topic)
        OPTIONAL MATCH (d)-[r4:MEMBER_OF]->(org:Organization)
        RETURN d, repo, tech, topic, org, r1, r2, r3, r4
        LIMIT $limit
      `, { username: normalizeUsername(username), limit: neo4j.int(limit) });
      return result.records;
    } finally {
      await session.close();
    }
  }

  /**
   * Expand a Technology node: return its repositories and their contributors.
   */
  async expandTechnology(normalizedName, limit = 20) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (t:Technology {normalizedName: $name})
        OPTIONAL MATCH (r:Repository)-[rel1:USES_TECHNOLOGY]->(t)
        OPTIONAL MATCH (d:Developer)-[rel2:CONTRIBUTES_TO]->(r)
        OPTIONAL MATCH (r)-[rel3:USES_TECHNOLOGY]->(related:Technology)
        WHERE related.normalizedName <> $name
        RETURN t, r, d, rel1, rel2, related, rel3
        LIMIT $limit
      `, { name: normalizeName(normalizedName), limit: neo4j.int(limit) });
      return result.records;
    } finally {
      await session.close();
    }
  }

  /**
   * Expand a Repository node: return its contributors, technologies, topics, owning org.
   */
  async expandRepository(fullName, limit = 20) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (r:Repository {fullName: $fullName})
        OPTIONAL MATCH (d:Developer)-[rel1:CONTRIBUTES_TO]->(r)
        OPTIONAL MATCH (r)-[rel2:USES_TECHNOLOGY]->(t:Technology)
        OPTIONAL MATCH (r)-[rel3:HAS_TOPIC]->(topic:Topic)
        OPTIONAL MATCH (r)-[rel4:OWNED_BY]->(org:Organization)
        RETURN r, d, t, topic, org, rel1, rel2, rel3, rel4
        LIMIT $limit
      `, { fullName, limit: neo4j.int(limit) });
      return result.records;
    } finally {
      await session.close();
    }
  }

  /**
   * Expand a Topic node: return its repositories and their contributors.
   */
  async expandTopic(normalizedName, limit = 20) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (topic:Topic {normalizedName: $name})
        OPTIONAL MATCH (r:Repository)-[rel1:HAS_TOPIC]->(topic)
        OPTIONAL MATCH (d:Developer)-[rel2:CONTRIBUTES_TO]->(r)
        RETURN topic, r, d, rel1, rel2
        LIMIT $limit
      `, { name: normalizeName(normalizedName), limit: neo4j.int(limit) });
      return result.records;
    } finally {
      await session.close();
    }
  }

  /**
   * Expand an Organization node: return its developers and repositories.
   */
  async expandOrganization(login, limit = 20) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (o:Organization {login: $login})
        OPTIONAL MATCH (d:Developer)-[rel1:MEMBER_OF]->(o)
        OPTIONAL MATCH (r:Repository)-[rel2:OWNED_BY]->(o)
        OPTIONAL MATCH (d2:Developer)-[rel3:CONTRIBUTES_TO]->(r)
        RETURN o, d, r, rel1, rel2, d2, rel3
        LIMIT $limit
      `, { login, limit: neo4j.int(limit) });
      return result.records;
    } finally {
      await session.close();
    }
  }

  isValidNodeType(type) {
    return ALLOWED_NODE_TYPES.has(type);
  }
}

export default new GraphRepository();
