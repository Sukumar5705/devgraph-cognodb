import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Search, GitCommit, Loader2 } from 'lucide-react';
import { getDeveloperPath } from '../api/connectionApi';
import type { ConnectionPath } from '../types/graph';
import { getNodeLabel, getNodeColor } from '../utils/graph';

export function ConnectionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFrom = searchParams.get('from') || '';
  const initialTo = searchParams.get('to') || '';

  const [fromDev, setFromDev] = useState(initialFrom);
  const [toDev, setToDev] = useState(initialTo);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConnectionPath | null>(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-submit if both are present in URL on mount
  useState(() => {
    if (initialFrom && initialTo && !hasSearched) {
      handleSearch(null, initialFrom, initialTo);
    }
  });

  async function handleSearch(e: React.FormEvent | null, from = fromDev, to = toDev) {
    if (e) e.preventDefault();
    if (!from || !to) return;

    setSearchParams({ from, to });
    setLoading(true);
    setError('');
    setResult(null);
    setHasSearched(true);

    try {
      const data = await getDeveloperPath(from, to);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to find connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Find Developer Connection</h1>
        <p className="text-gray-500">Discover the shortest path between two developers in the graph.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={fromDev}
              onChange={e => setFromDev(e.target.value)}
              placeholder="Developer A (e.g. torvalds)"
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>
          
          <ArrowRight className="text-gray-300 hidden md:block shrink-0" size={24} />
          
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={toDev}
              onChange={e => setToDev(e.target.value)}
              placeholder="Developer B (e.g. gaearon)"
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !fromDev || !toDev}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Find Connection
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-4 text-blue-600" />
          <p>Finding shortest graph path...</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center">
          {error}
        </div>
      )}

      {!loading && hasSearched && result && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          {!result.found ? (
            <div className="text-center text-gray-500 py-8">
              <GitCommit size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-900 mb-1">No connection found</p>
              <p className="text-sm">{result.message || 'No connection found within the explored graph depth.'}</p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <GitCommit size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Connection Found</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Connected in {result.relationships.length} relationships
                </p>
              </div>

              {/* Path Visualization */}
              <div className="max-w-md mx-auto">
                {result.path.map((node, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Node Card */}
                    <div 
                      className="w-full p-4 rounded-xl border flex flex-col items-center text-center relative z-10"
                      style={{ 
                        backgroundColor: `${getNodeColor(node.type)}10`,
                        borderColor: `${getNodeColor(node.type)}40` 
                      }}
                    >
                      <span 
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
                        style={{ 
                          backgroundColor: getNodeColor(node.type),
                          color: '#fff'
                        }}
                      >
                        {node.type}
                      </span>
                      {node.type === 'Developer' ? (
                        <Link 
                          to={`/developers/${node.properties.username}`}
                          className="font-bold text-gray-900 hover:text-blue-600 hover:underline"
                        >
                          {getNodeLabel(node as any)}
                        </Link>
                      ) : node.type === 'Technology' ? (
                        <Link 
                          to={`/technologies/${node.properties.normalizedName}`}
                          className="font-bold text-gray-900 hover:text-emerald-600 hover:underline"
                        >
                          {getNodeLabel(node as any)}
                        </Link>
                      ) : (
                        <span className="font-bold text-gray-900">{getNodeLabel(node as any)}</span>
                      )}
                    </div>

                    {/* Edge (except for the last node) */}
                    {i < result.path.length - 1 && (
                      <div className="py-3 flex flex-col items-center">
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest my-1 bg-white px-2">
                          {result.relationships[i]}
                        </div>
                        <div className="w-px h-6 bg-gray-300 relative">
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-b-2 border-r-2 border-gray-300 transform rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
