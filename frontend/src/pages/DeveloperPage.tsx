import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDeveloper, getDeveloperConnections } from '../api/developerApi';
import type { DeveloperProfile, DeveloperConnection } from '../types/graph';
import { Building2, MapPin, Users, BookOpen, Network, GitBranch } from 'lucide-react';

export function DeveloperPage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [connections, setConnections] = useState<DeveloperConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError('');

    getDeveloper(username)
      .then(data => {
        setProfile(data);
        // Also load connected developers
        return getDeveloperConnections(username, 6);
      })
      .then(setConnections)
      .catch(err => setError(err.message || 'Developer not found.'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
        <h2 className="text-lg font-semibold mb-2">Developer not found</h2>
        <p className="text-sm mb-4">{error || 'This developer does not exist on GitHub.'}</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Search again</Link>
      </div>
    );
  }

  const { developer, repositories, technologies, topics, organizations } = profile;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={developer.avatarUrl || `https://github.com/${developer.username}.png`}
          alt={developer.username}
          className="w-24 h-24 rounded-full border border-gray-200 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{developer.name || developer.username}</h1>
          <p className="text-gray-500 mb-3">@{developer.username}</p>
          {developer.bio && <p className="text-gray-700 text-sm mb-4 leading-relaxed">{developer.bio}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5">
            {developer.followers !== undefined && (
              <span className="flex items-center gap-1.5"><Users size={14} />{developer.followers} followers</span>
            )}
            {developer.publicRepos !== undefined && (
              <span className="flex items-center gap-1.5"><BookOpen size={14} />{developer.publicRepos} repos</span>
            )}
            {developer.location && (
              <span className="flex items-center gap-1.5"><MapPin size={14} />{developer.location}</span>
            )}
            {developer.company && (
              <span className="flex items-center gap-1.5"><Building2 size={14} />{developer.company}</span>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              to={`/developers/${username}/network`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Network size={16} /> Explore Network
            </Link>
            <Link
              to={`/connections?from=${username}`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <GitBranch size={16} /> Find Connection
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        {/* Technologies */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Technologies</h2>
          {technologies.length === 0 ? (
            <p className="text-gray-400 text-sm">No technologies found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 20).map(t => (
                <Link
                  key={t.normalizedName}
                  to={`/technologies/${t.normalizedName}`}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Topics */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Topics</h2>
          {topics.length === 0 ? (
            <p className="text-gray-400 text-sm">No topics found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topics.slice(0, 20).map(t => (
                <span
                  key={t.normalizedName}
                  className="px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium border border-violet-100"
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Repositories */}
      {repositories.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Repositories</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {repositories.slice(0, 6).map(r => (
              <a
                key={r.fullName}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="block p-3 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900 truncate">{r.name}</div>
                {r.description && (
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.description}</div>
                )}
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span>★ {r.stars}</span>
                  <span>⑂ {r.forks}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Connected Developers */}
      {connections.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Connected Developers</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {connections.map(dev => (
              <Link
                key={dev.username}
                to={`/developers/${dev.username}`}
                className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <img
                  src={dev.avatarUrl || `https://github.com/${dev.username}.png`}
                  alt={dev.username}
                  className="w-9 h-9 rounded-full border border-gray-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-medium text-sm text-gray-900">@{dev.username}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {dev.reasons?.[0] || `${dev.totalConnections} shared connections`}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dev.sharedTechnologies.slice(0, 3).map(t => (
                      <span key={t} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
