import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTechnologyCommunity } from '../api/technologyApi';
import type { TechnologyCommunity } from '../types/graph';
import { Users, BookOpen, Layers } from 'lucide-react';

export function TechnologyPage() {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<TechnologyCommunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    setError('');

    getTechnologyCommunity(name)
      .then(setData)
      .catch(err => setError(err.message || 'Technology community not found.'))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
        <h2 className="text-lg font-semibold mb-2">Technology not found</h2>
        <p className="text-sm mb-4">{error || 'This technology does not exist in the explored graph.'}</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Return home</Link>
      </div>
    );
  }

  const { technology, developers, repositories, relatedTechnologies, topics } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Technology Community</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{technology.name}</h1>

        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl min-w-[120px]">
            <Users className="text-emerald-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-gray-900">{technology.devCount || developers.length}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Developers</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl min-w-[120px]">
            <BookOpen className="text-emerald-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-gray-900">{technology.repoCount || repositories.length}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Repositories</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Column: Developers & Repositories */}
        <div className="md:col-span-2 space-y-6">
          {/* Developers */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={18} className="text-gray-400" />
              Community Developers
            </h2>
            {developers.length === 0 ? (
              <p className="text-gray-500 text-sm">No developers found in this community yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {developers.map(dev => (
                  <Link
                    key={dev.username}
                    to={`/developers/${dev.username}`}
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <img
                      src={dev.avatarUrl || `https://github.com/${dev.username}.png`}
                      alt={dev.username}
                      className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">
                        {dev.name || `@${dev.username}`}
                      </div>
                      <div className="text-xs text-gray-500 truncate">@{dev.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Repositories */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-gray-400" />
              Key Repositories
            </h2>
            {repositories.length === 0 ? (
              <p className="text-gray-500 text-sm">No repositories found using this technology.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {repositories.map(repo => (
                  <a
                    key={repo.fullName}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors bg-gray-50"
                  >
                    <div className="font-semibold text-sm text-gray-900 truncate mb-1">{repo.name}</div>
                    <div className="text-xs text-gray-500 mb-3 truncate">by {repo.ownerUsername}</div>
                    <div className="flex gap-4 text-xs font-medium text-gray-600">
                      <span>★ {repo.stars}</span>
                      <span>⑂ {repo.forks}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Related Tech & Topics */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Layers size={16} className="text-emerald-500" />
              Related Technologies
            </h2>
            {relatedTechnologies.length === 0 ? (
              <p className="text-gray-500 text-sm">No related technologies found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {relatedTechnologies.map(tech => (
                  <Link
                    key={tech.normalizedName}
                    to={`/technologies/${tech.normalizedName}`}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                  >
                    {tech.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {topics.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Shared Topics</h2>
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => (
                  <span
                    key={topic.normalizedName}
                    className="px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium border border-violet-100"
                  >
                    {topic.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
