import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { driver, getSession, verifyConnection, closeDriver } from '../src/database/neo4j.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("Connecting to CognoDB...");
  const isConnected = await verifyConnection();
  if (!isConnected) {
    console.error("Failed to connect to CognoDB. Exiting.");
    process.exit(1);
  }

  const session = getSession();

  try {

    console.log("Applying schema constraints...");
    const schemaFile = path.join(__dirname, '..', 'queries', 'schema.cypher');
    const schemaCypher = await fs.readFile(schemaFile, 'utf8');
    const statements = schemaCypher.split(';').filter(s => s.trim().length > 0);

    for (const statement of statements) {
      await session.run(statement);
    }
    console.log("Schema applied.");

    const rawDataFile = path.join(__dirname, '..', 'data', 'seed', 'raw.json');
    const rawData = JSON.parse(await fs.readFile(rawDataFile, 'utf8'));

    console.log(`Seeding data for ${rawData.developers.length} developers...`);

    for (const { profile, repos } of rawData.developers) {
      const username = profile.username.trim().toLowerCase();
      await session.run(`
        MERGE (d:Developer {username: $username})
        SET d += $props
      `, {
        username: username,
        props: profile
      });

      if (profile.company) {
        const orgLogin = profile.company.replace(/^@/, '').trim();
        await session.run(`
          MERGE (o:Organization {login: $login})
          SET o.name = $login
          MERGE (d:Developer {username: $username})
          MERGE (d)-[:MEMBER_OF]->(o)
        `, {
          login: orgLogin,
          username: username
        });
      }

      for (const repo of repos) {
        await session.run(`
          MERGE (r:Repository {fullName: $fullName})
          SET r += $props
        `, {
          fullName: repo.fullName,
          props: {
            name: repo.name,
            ownerUsername: repo.ownerUsername,
            description: repo.description,
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

        await session.run(`
          MATCH (d:Developer {username: $username})
          MATCH (r:Repository {fullName: $fullName})
          MERGE (d)-[:CONTRIBUTES_TO]->(r)
        `, {
          username: username,
          fullName: repo.fullName
        });

        if (repo.ownerType === 'Organization') {
          await session.run(`
            MERGE (o:Organization {login: $login})
            WITH o
            MATCH (r:Repository {fullName: $fullName})
            MERGE (r)-[:OWNED_BY]->(o)
          `, {
            login: repo.ownerUsername,
            fullName: repo.fullName
          });
        }

        // Repository -> USES_TECHNOLOGY -> Technology
        const languages = new Set([...(repo.languages || []), repo.language].filter(Boolean));
        for (const lang of languages) {
          const normalizedLang = lang.toLowerCase();
          await session.run(`
            MERGE (t:Technology {normalizedName: $normalizedName})
            SET t.name = $name
            WITH t
            MATCH (r:Repository {fullName: $fullName})
            MERGE (r)-[:USES_TECHNOLOGY]->(t)
          `, {
            normalizedName: normalizedLang,
            name: lang,
            fullName: repo.fullName
          });
        }

        for (const topic of repo.topics || []) {
          const normalizedTopic = topic.toLowerCase();
          await session.run(`
            MERGE (t:Topic {normalizedName: $normalizedName})
            SET t.name = $name
            WITH t
            MATCH (r:Repository {fullName: $fullName})
            MERGE (r)-[:HAS_TOPIC]->(t)
          `, {
            normalizedName: normalizedTopic,
            name: topic,
            fullName: repo.fullName
          });
        }
      }
    }

    let developers = 0;
    let repositories = 0;
    let technologies = 0;
    let topics = 0;
    let organizations = 0;
    let relationships = 0;

    const counts = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] as label, count(n) as count
    `);
    for (const record of counts.records) {
      const label = record.get('label');
      const count = Number(record.get('count')) || 0;
      if (label === 'Developer') developers = count;
      else if (label === 'Repository') repositories = count;
      else if (label === 'Technology') technologies = count;
      else if (label === 'Topic') topics = count;
      else if (label === 'Organization') organizations = count;
    }

    const relCounts = await session.run(`
      MATCH ()-[r]->()
      RETURN count(r) as count
    `);
    if (relCounts.records.length > 0) {
      relationships = Number(relCounts.records[0].get('count')) || 0;
    }

    console.log("\nDevGraph seed completed successfully\n");
    console.log(`Developers: ${developers}`);
    console.log(`Repositories: ${repositories}`);
    console.log(`Technologies: ${technologies}`);
    console.log(`Topics: ${topics}`);
    console.log(`Organizations: ${organizations}`);
    console.log(`Relationships: ${relationships}`);
    console.log("Errors: 0");

  } catch (error) {
    console.error("Error during seeding:", error);
    try {
      await session.close();
      await closeDriver();
    } catch (cleanupErr) {
      // ignore cleanup errors during failure
    }
    process.exit(1);
  } finally {
    await session.close();
    await closeDriver();
  }
}

run();
