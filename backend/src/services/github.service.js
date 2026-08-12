import axios from 'axios';
import logger from '../utils/logger.js';
import { mapGitHubProfile, mapGitHubRepo } from '../mappers/github.mapper.js';

const headers = {
  Accept: 'application/vnd.github.v3+json'
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers,
  timeout: 10000
});

const getProfile = async (username) => {
  try {
    const { data } = await githubAPI.get(`/users/${username}`);
    logger.debug(`Fetched GitHub profile for: ${username}`);
    return mapGitHubProfile(data);
  } catch (err) {
    handleGitHubError(err, username);
  }
};

const getRepositories = async (username) => {
  try {
    const { data } = await githubAPI.get(`/users/${username}/repos`, {
      params: { per_page: 100, sort: 'updated' }
    });
    logger.debug(`Fetched ${data.length} repos for: ${username}`);
    return data.map(mapGitHubRepo);
  } catch (err) {
    handleGitHubError(err, username);
  }
};

const getRepositoryLanguages = async (owner, repo) => {
  try {
    const { data } = await githubAPI.get(`/repos/${owner}/${repo}/languages`);
    return data;
  } catch {
    return {};
  }
};

const getOrganizations = async (username) => {
  try {
    const { data } = await githubAPI.get(`/users/${username}/orgs`);
    return data.map(org => ({
      login: org.login,
      name: org.login,
      url: `https://github.com/${org.login}`
    }));
  } catch {
    return [];
  }
};

function handleGitHubError(err, username) {
  if (err.response?.status === 404) {
    const error = new Error(`GitHub user "${username}" not found`);
    error.statusCode = 404;
    throw error;
  }
  if (err.response?.status === 403) {
    const error = new Error('GitHub API rate limit exceeded');
    error.statusCode = 429;
    throw error;
  }
  logger.error(`GitHub API error: ${err.message}`);
  throw err;
}

export { getProfile, getRepositories, getRepositoryLanguages, getOrganizations };
