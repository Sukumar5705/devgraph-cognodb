import neo4j from 'neo4j-driver';
import { getSession } from '../database/neo4j.js';
import { normalizeUsername, toNumber } from '../utils/normalize.js';

class ConnectionRepository {
  async getRelatedByTechnology(username, limit = 10) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (d:Developer {username: $username})
              -[:CONTRIBUTES_TO]->(:Repository)
              -[:USES_TECHNOLOGY]->(t:Technology)
              <-[:USES_TECHNOLOGY]-(:Repository)
              <-[:CONTRIBUTES_TO]-(other:Developer)
        WHERE other.username <> $username
        WITH other, collect(DISTINCT t.name) AS sharedTechnologies
        RETURN other.username AS username,
               other.name AS name,
               other.avatarUrl AS avatarUrl,
               sharedTechnologies,
               size(sharedTechnologies) AS sharedCount
        ORDER BY sharedCount DESC
        LIMIT $limit
      `, { username: normalizeUsername(username), limit: neo4j.int(limit) });

      return result.records.map(record => ({
        username: record.get('username'),
        name: record.get('name'),
        avatarUrl: record.get('avatarUrl'),
        sharedTechnologies: record.get('sharedTechnologies'),
        sharedCount: toNumber(record.get('sharedCount'))
      }));
    } finally {
      await session.close();
    }
  }

  async getRelatedByTopics(username, limit = 10) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (d:Developer {username: $username})
              -[:CONTRIBUTES_TO]->(:Repository)
              -[:HAS_TOPIC]->(t:Topic)
              <-[:HAS_TOPIC]-(:Repository)
              <-[:CONTRIBUTES_TO]-(other:Developer)
        WHERE other.username <> $username
        WITH other, collect(DISTINCT t.name) AS sharedTopics
        RETURN other.username AS username,
               other.name AS name,
               other.avatarUrl AS avatarUrl,
               sharedTopics,
               size(sharedTopics) AS sharedCount
        ORDER BY sharedCount DESC
        LIMIT $limit
      `, { username: normalizeUsername(username), limit: neo4j.int(limit) });

      return result.records.map(record => ({
        username: record.get('username'),
        name: record.get('name'),
        avatarUrl: record.get('avatarUrl'),
        sharedTopics: record.get('sharedTopics'),
        sharedCount: toNumber(record.get('sharedCount'))
      }));
    } finally {
      await session.close();
    }
  }

  async getRelatedByOrganization(username, limit = 10) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (d:Developer {username: $username})
              -[:MEMBER_OF]->(o:Organization)
              <-[:MEMBER_OF]-(other:Developer)
        WHERE other.username <> $username
        WITH other, collect(DISTINCT o.login) AS sharedOrganizations
        RETURN other.username AS username,
               other.name AS name,
               other.avatarUrl AS avatarUrl,
               sharedOrganizations,
               size(sharedOrganizations) AS sharedCount
        ORDER BY sharedCount DESC
        LIMIT $limit
      `, { username: normalizeUsername(username), limit: neo4j.int(limit) });

      return result.records.map(record => ({
        username: record.get('username'),
        name: record.get('name'),
        avatarUrl: record.get('avatarUrl'),
        sharedOrganizations: record.get('sharedOrganizations'),
        sharedCount: toNumber(record.get('sharedCount'))
      }));
    } finally {
      await session.close();
    }
  }

  async getConnectedDevelopers(username, limit = 15) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (d:Developer {username: $username})

        OPTIONAL MATCH (d)-[:CONTRIBUTES_TO]->(:Repository)-[:USES_TECHNOLOGY]->(t:Technology)
                        <-[:USES_TECHNOLOGY]-(:Repository)<-[:CONTRIBUTES_TO]-(other1:Developer)
        WHERE other1.username <> $username
        WITH d, collect(DISTINCT {dev: other1, tech: t.name}) AS techPairs

        OPTIONAL MATCH (d)-[:CONTRIBUTES_TO]->(:Repository)-[:HAS_TOPIC]->(tp:Topic)
                        <-[:HAS_TOPIC]-(:Repository)<-[:CONTRIBUTES_TO]-(other2:Developer)
        WHERE other2.username <> $username
        WITH d, techPairs, collect(DISTINCT {dev: other2, topic: tp.name}) AS topicPairs

        OPTIONAL MATCH (d)-[:MEMBER_OF]->(o:Organization)<-[:MEMBER_OF]-(other3:Developer)
        WHERE other3.username <> $username
        WITH techPairs, topicPairs, collect(DISTINCT {dev: other3, org: o.login}) AS orgPairs

        WITH [x IN techPairs | x.dev] + [x IN topicPairs | x.dev] + [x IN orgPairs | x.dev] AS allDevs,
             techPairs, topicPairs, orgPairs

        UNWIND allDevs AS connDev
        WITH DISTINCT connDev, techPairs, topicPairs, orgPairs

        WITH connDev,
             [x IN techPairs WHERE x.dev = connDev | x.tech] AS rawTech,
             [x IN topicPairs WHERE x.dev = connDev | x.topic] AS rawTopics,
             [x IN orgPairs WHERE x.dev = connDev | x.org] AS rawOrgs

        WITH connDev, rawTech, rawTopics, rawOrgs,
             REDUCE(s = [], t IN rawTech | CASE WHEN t IN s THEN s ELSE s + t END) AS sharedTechnologies,
             REDUCE(s = [], t IN rawTopics | CASE WHEN t IN s THEN s ELSE s + t END) AS sharedTopics,
             REDUCE(s = [], o IN rawOrgs | CASE WHEN o IN s THEN s ELSE s + o END) AS sharedOrganizations

        WITH connDev, sharedTechnologies, sharedTopics, sharedOrganizations,
             size(sharedTechnologies) + size(sharedTopics) + size(sharedOrganizations) AS totalConnections

        WHERE totalConnections > 0

        RETURN connDev.username AS username,
               connDev.name AS name,
               connDev.avatarUrl AS avatarUrl,
               sharedTechnologies,
               sharedTopics,
               sharedOrganizations,
               totalConnections
        ORDER BY totalConnections DESC
        LIMIT $limit
      `, { username: normalizeUsername(username), limit: neo4j.int(limit) });

      return result.records.map(record => ({
        username: record.get('username'),
        name: record.get('name'),
        avatarUrl: record.get('avatarUrl'),
        sharedTechnologies: record.get('sharedTechnologies'),
        sharedTopics: record.get('sharedTopics'),
        sharedOrganizations: record.get('sharedOrganizations'),
        totalConnections: toNumber(record.get('totalConnections'))
      }));
    } finally {
      await session.close();
    }
  }

  async getDeveloperToDevPath(fromUsername, toUsername) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (a:Developer {username: $from}),
              (b:Developer {username: $to})
        MATCH p = shortestPath((a)-[*1..6]-(b))
        RETURN p
        LIMIT 1
      `, {
        from: normalizeUsername(fromUsername),
        to: normalizeUsername(toUsername)
      });

      if (result.records.length === 0) return null;
      return result.records[0].get('p');
    } finally {
      await session.close();
    }
  }
}

export default new ConnectionRepository();
