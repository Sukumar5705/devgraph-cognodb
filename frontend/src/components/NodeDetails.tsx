import { Link } from 'react-router-dom';
import type { NodeDetails as NodeDetailsType } from '../types/graph';
import { getNodeLabel } from '../utils/graph';
import { Loader2 } from 'lucide-react';

interface NodeDetailsProps {
  details: NodeDetailsType | null;
  onExpand: () => void;
  isExpanding: boolean;
  rootDeveloperUsername?: string; // To help determine if we show "Why connected?"
}

export function NodeDetails({ details, onExpand, isExpanding, rootDeveloperUsername }: NodeDetailsProps) {
  if (!details) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        Select a node in the graph to view its details.
      </div>
    );
  }

  const { node, connectionReasons } = details;
  const p = node.properties;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
            {node.type}
          </span>
          <h2 className="text-xl font-bold text-gray-900 break-words">{getNodeLabel(node)}</h2>
        </div>

        {/* Property Display based on node type */}
        <div className="space-y-4 text-sm text-gray-700">
          {node.type === 'Developer' && (
            <>
              {p.name && <p><span className="font-semibold">Name:</span> {p.name as string}</p>}
              {p.publicRepos !== undefined && <p><span className="font-semibold">Repositories:</span> {p.publicRepos as number}</p>}
            </>
          )}

          {node.type === 'Repository' && (
            <>
              {p.description && <p className="text-gray-600 italic">{p.description as string}</p>}
              <div className="flex gap-4 text-xs font-medium mt-2">
                <span>★ {p.stars as number}</span>
                <span>⑂ {p.forks as number}</span>
              </div>
            </>
          )}

          {node.type === 'Technology' && (
            <>
              {p.devCount !== undefined && <p><span className="font-semibold">Developers:</span> {p.devCount as number}</p>}
              {p.repoCount !== undefined && <p><span className="font-semibold">Repositories:</span> {p.repoCount as number}</p>}
            </>
          )}

          {node.type === 'Topic' && (
            <>
              {/* Minimal properties for Topic usually */}
              <p className="text-gray-600">A topic linking repositories.</p>
            </>
          )}

          {node.type === 'Organization' && (
            <>
              {p.name && <p><span className="font-semibold">Name:</span> {p.name as string}</p>}
            </>
          )}
        </div>

        {/* Why connected section (Only for developers other than the root) */}
        {node.type === 'Developer' && rootDeveloperUsername && p.username !== rootDeveloperUsername && connectionReasons && connectionReasons.length > 0 && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Why connected?</h3>
            <ul className="space-y-2">
              {connectionReasons.map((reason, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                to={`/connections?from=${rootDeveloperUsername}&to=${p.username}`}
                className="inline-block px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                View Connection Path
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
        <button
          onClick={onExpand}
          disabled={isExpanding}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 text-white font-medium text-sm rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors"
        >
          {isExpanding && <Loader2 size={16} className="animate-spin" />}
          {isExpanding ? 'Exploring connections...' : 'Expand Graph Node'}
        </button>

        {node.type === 'Developer' && (
          <Link
            to={`/developers/${p.username}`}
            className="w-full text-center py-2 px-4 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Developer
          </Link>
        )}

        {node.type === 'Technology' && (
          <Link
            to={`/technologies/${p.normalizedName}`}
            className="w-full text-center py-2 px-4 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Explore Community
          </Link>
        )}

        {node.type === 'Repository' && p.url && (
          <a
            href={p.url as string}
            target="_blank"
            rel="noreferrer"
            className="w-full text-center py-2 px-4 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Open Repository
          </a>
        )}
      </div>
    </div>
  );
}
