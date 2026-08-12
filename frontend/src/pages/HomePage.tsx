import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const EXAMPLE_USERS = ['torvalds', 'gaearon', 'sindresorhus', 'octocat'];

export function HomePage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed) navigate(`/developers/${trimmed}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          Dev<span className="text-blue-600">Graph</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10">
          Explore how developers, repositories, and technologies are connected.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            id="username-search"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="GitHub username (e.g. torvalds)"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            autoFocus
          />
          <button
            type="submit"
            id="search-btn"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Search size={18} />
            Explore
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-gray-400">Try:</span>
          {EXAMPLE_USERS.map(u => (
            <button
              key={u}
              onClick={() => navigate(`/developers/${u}`)}
              className="text-sm px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors bg-white"
            >
              {u}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
