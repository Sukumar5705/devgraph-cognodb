import { getSession } from '../database/neo4j.js';
import { normalizeUsername, normalizeName } from '../utils/normalize.js';

class PathRepository {
  async findDeveloperToTechPath(username, technology) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (d:Developer {username: $username}),
              (t:Technology {normalizedName: $technology})
        MATCH p = shortestPath((d)-[*1..4]-(t))
        RETURN p
        LIMIT 1
      `, {
        username: normalizeUsername(username),
        technology: normalizeName(technology)
      });

      if (result.records.length === 0) return null;
      return result.records[0].get('p');
    } finally {
      await session.close();
    }
  }

  async findGenericPath(fromLabel, fromKey, fromValue, toLabel, toKey, toValue) {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (a:${fromLabel} {${fromKey}: $fromValue}),
              (b:${toLabel} {${toKey}: $toValue})
        MATCH p = shortestPath((a)-[*1..6]-(b))
        RETURN p
        LIMIT 1
      `, { fromValue, toValue });

      if (result.records.length === 0) return null;
      return result.records[0].get('p');
    } finally {
      await session.close();
    }
  }
}

export default new PathRepository();
