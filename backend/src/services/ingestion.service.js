import { getSession } from '../database/neo4j.js';
import { getProfile, getRepositories, getRepositoryLanguages, getOrganizations } from './github.service.js';
import { normalizeUsername } from '../utils/normalize.js';
import logger from '../utils/logger.js';

class IngestionService {
  async ingestDeveloper(username) {
    const normalized = normalizeUsername(username);
    logger.info(`Ingesting developer: ${normalized}`);

    const profile = await getProfile(normalized);
    if (!profile) {
      const error = new Error(`GitHub user "${username}" not found`);
      error.statusCode = 404;
      throw error;
    }

    const repos = await getRepositories(normalized);
    const orgs = await getOrganizations(normalized);

    const enhancedRepos = [];
    for (const repo of (repos || []).slice(0, 10)) {
      if (!repo.isFork) {
        const languagesObj = await getRepositoryLanguages(repo.ownerUsername, repo.name);
        repo.languages = Object.keys(languagesObj || {});
      } else {
        repo.languages = repo.language ? [repo.language] : [];
      }
      enhancedRepos.push(repo);
      await new Promise(r => setTimeout(r, 150));
    }

    const session = getSession();
    try {
      await session.executeWrite(async tx => {
        await tx.run(`
          MERGE (d:Developer {username: $username})
          SET d += $props
        `, {
          username: normalized,
          props: {
            ...profile,
            username: normalized
          }
        });

        for (const org of orgs) {
          await tx.run(`
            MERGE (o:Organization {login: $login})
            SET o.name = $name, o.url = $url
            WITH o
            MATCH (d:Developer {username: $username})
            MERGE (d)-[:MEMBER_OF]->(o)
          `, {
            login: org.login,
            name: org.name || org.login,
            url: org.url || '',
            username: normalized
          });
        }

        if (profile.company) {
          const orgLogin = profile.company.replace(/^@/, '').trim();
          await tx.run(`
            MERGE (o:Organization {login: $login})
            SET o.name = $login
            WITH o
            MATCH (d:Developer {username: $username})
            MERGE (d)-[:MEMBER_OF]->(o)
          `, { login: orgLogin, username: normalized });
        }

        for (const repo of enhancedRepos) {
          await tx.run(`
            MERGE (r:Repository {fullName: $fullName})
            SET r += $props
          `, {
            fullName: repo.fullName,
            props: {
              name: repo.name,
              ownerUsername: repo.ownerUsername,
              description: repo.description || '',
              url: repo.url,
              stars: repo.stars,
              forks: repo.forks,
              watchers: repo.watchers,
              openIssues: repo.openIssues,
              defaultBranch: repo.defaultBranch,
              isFork: repo.isFork,
              createdAt: repo.createdAt,
              updatedAt: repo.updatedAt
            }
          });

          await tx.run(`
            MATCH (d:Developer {username: $username})
            MATCH (r:Repository {fullName: $fullName})
            MERGE (d)-[:CONTRIBUTES_TO]->(r)
          `, { username: normalized, fullName: repo.fullName });

          if (repo.ownerType === 'Organization') {
            await tx.run(`
              MERGE (o:Organization {login: $login})
              WITH o
              MATCH (r:Repository {fullName: $fullName})
              MERGE (r)-[:OWNED_BY]->(o)
            `, { login: repo.ownerUsername, fullName: repo.fullName });
          }

          const languages = new Set([...(repo.languages || []), repo.language].filter(Boolean));
          for (const lang of languages) {
            await tx.run(`
              MERGE (t:Technology {normalizedName: $normalizedName})
              SET t.name = $name
              WITH t
              MATCH (r:Repository {fullName: $fullName})
              MERGE (r)-[:USES_TECHNOLOGY]->(t)
            `, {
              normalizedName: lang.toLowerCase(),
              name: lang,
              fullName: repo.fullName
            });
          }

          for (const topic of (repo.topics || [])) {
            await tx.run(`
              MERGE (t:Topic {normalizedName: $normalizedName})
              SET t.name = $name
              WITH t
              MATCH (r:Repository {fullName: $fullName})
              MERGE (r)-[:HAS_TOPIC]->(t)
            `, {
              normalizedName: topic.toLowerCase(),
              name: topic,
              fullName: repo.fullName
            });
          }
        }
      });

      logger.info(`Successfully ingested ${normalized}: ${enhancedRepos.length} repos, ${orgs.length} orgs`);
    } finally {
      await session.close();
    }
  }
}

export default new IngestionService();
