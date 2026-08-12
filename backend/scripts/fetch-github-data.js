import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProfile, getRepositories, getRepositoryLanguages } from '../src/services/github.service.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_USERS = [
  'octocat',
  'gaearon',
  'sindresorhus',
  'torvalds'
];

async function run() {
  const data = { developers: [] };

  for (const username of SEED_USERS) {
    try {
      console.log(`Fetching profile for ${username}...`);
      const profile = await getProfile(username);
      if (!profile) continue;

      console.log(`Fetching repos for ${username}...`);
      const repos = await getRepositories(username);
      if (!repos) {
        data.developers.push({ profile, repos: [] });
        continue;
      }

      const enhancedRepos = [];

      for (const repo of repos.slice(0, 5)) {
        if (!repo.isFork) {
          console.log(`  Fetching languages for ${repo.fullName}...`);
          const languagesObj = await getRepositoryLanguages(repo.ownerUsername, repo.name);
          repo.languages = Object.keys(languagesObj || {});
        } else {
          repo.languages = repo.language ? [repo.language] : [];
        }
        enhancedRepos.push(repo);
        await new Promise(r => setTimeout(r, 200));
      }

      data.developers.push({
        profile,
        repos: enhancedRepos
      });

    } catch (error) {
      console.error(`Failed to fetch data for ${username}: ${error.message}`);
    }
  }

  const targetDir = path.join(__dirname, '..', 'data', 'seed');
  await fs.mkdir(targetDir, { recursive: true });

  const targetFile = path.join(targetDir, 'raw.json');
  await fs.writeFile(targetFile, JSON.stringify(data, null, 2));
  console.log(`\nSuccessfully wrote raw seed data to ${targetFile}`);
}

run();
