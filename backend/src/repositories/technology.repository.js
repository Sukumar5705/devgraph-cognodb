import neo4j from 'neo4j-driver';
import { getSession } from '../database/neo4j.js';
import { normalizeName, toNumber } from '../utils/normalize.js';

class TechnologyRepository {
  async getTechnology(name) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (t:Technology {normalizedName: $name})
        OPTIONAL MATCH (r:Repository)-[:USES_TECHNOLOGY]->(t)
        OPTIONAL MATCH (d:Developer)-[:CONTRIBUTES_TO]->(r)
        RETURN t,
               count(DISTINCT r) AS repoCount,
               count(DISTINCT d) AS devCount
      `, { name: normalizeName(name) });

      if (result.records.length === 0) return null;
      const record = result.records[0];
      return {
        ...record.get('t').properties,
        repoCount: toNumber(record.get('repoCount')),
        devCount: toNumber(record.get('devCount'))
      };
    } finally {
      await session.close();
    }
  }

  async getTechnologyCommunity(name, limit = 20) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (t:Technology {normalizedName: $name})

        OPTIONAL MATCH (r:Repository)-[:USES_TECHNOLOGY]->(t)
        WITH t, collect(DISTINCT r) AS repos

        OPTIONAL MATCH (d:Developer)-[:CONTRIBUTES_TO]->(r2:Repository)-[:USES_TECHNOLOGY]->(t)
        WITH t, repos, collect(DISTINCT d) AS developers

        OPTIONAL MATCH (:Repository)-[:USES_TECHNOLOGY]->(t)
        WITH t, repos, developers
        OPTIONAL MATCH (r3:Repository)-[:USES_TECHNOLOGY]->(t)
        OPTIONAL MATCH (r3)-[:USES_TECHNOLOGY]->(related:Technology)
        WHERE related.normalizedName <> $name
        WITH t, repos, developers, collect(DISTINCT related) AS relatedTech

        OPTIONAL MATCH (:Repository)-[:USES_TECHNOLOGY]->(t)
        WITH t, repos, developers, relatedTech
        OPTIONAL MATCH (r4:Repository)-[:USES_TECHNOLOGY]->(t)
        OPTIONAL MATCH (r4)-[:HAS_TOPIC]->(topic:Topic)
        WITH t, repos, developers, relatedTech, collect(DISTINCT topic) AS topics

        RETURN t AS technology,
               developers[0..$limit] AS developers,
               repos[0..$limit] AS repositories,
               relatedTech[0..$limit] AS relatedTechnologies,
               topics[0..20] AS topics
      `, { name: normalizeName(name), limit: neo4j.int(limit) });

      if (result.records.length === 0) return null;
      const record = result.records[0];
      return {
        technology: record.get('technology').properties,
        developers: record.get('developers').map(n => n.properties),
        repositories: record.get('repositories').map(n => n.properties),
        relatedTechnologies: record.get('relatedTechnologies').map(n => n.properties),
        topics: record.get('topics').map(n => n.properties)
      };
    } finally {
      await session.close();
    }
  }
}

export default new TechnologyRepository();
