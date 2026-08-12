export const mapGitHubProfile = (data) => ({
  username: data.login,
  name: data.name,
  bio: data.bio,
  location: data.location,
  company: data.company,
  publicRepos: data.public_repos,
  followers: data.followers,
  following: data.following,
  avatarUrl: data.avatar_url,
  profileUrl: data.html_url
});

export const mapGitHubRepo = (data) => ({
  fullName: data.full_name,
  name: data.name,
  ownerUsername: data.owner.login,
  ownerType: data.owner.type,
  description: data.description,
  url: data.html_url,
  stars: data.stargazers_count,
  forks: data.forks_count,
  watchers: data.watchers_count,
  openIssues: data.open_issues_count,
  defaultBranch: data.default_branch,
  isFork: data.fork,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  language: data.language,
  topics: data.topics
});
