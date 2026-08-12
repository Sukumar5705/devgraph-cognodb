import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getDeveloperNetwork, getDeveloperConnections } from '../api/developerApi';
import { expandNode } from '../api/graphApi';
import type { GraphData, GraphNode, NodeDetails as NodeDetailsType } from '../types/graph';
import { mergeGraphData, deduplicateNodes, deduplicateEdges, buildConnectionExplanation } from '../utils/graph';
import { GraphView } from '../components/GraphView';
import { NodeDetails } from '../components/NodeDetails';

export function NetworkPage() {
  const { username } = useParams<{ username: string }>();
  
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
  // To populate "Why connected?" we need the developer connections mapping
  const [developerConnectionsMap, setDeveloperConnectionsMap] = useState<Record<string, string[]>>({});
  
  const [loading, setLoading] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError('');

    // Fetch initial neighborhood + developer connections
    Promise.all([
      getDeveloperNetwork(username),
      getDeveloperConnections(username, 50) // Fetch plenty to map out reasons
    ])
      .then(([networkData, connections]) => {
        setGraphData({
          nodes: deduplicateNodes(networkData.nodes),
          edges: deduplicateEdges(networkData.edges)
        });

        // Map connection reasons by username
        const connMap: Record<string, string[]> = {};
        for (const conn of connections) {
          connMap[conn.username] = buildConnectionExplanation(
            conn.sharedTechnologies,
            conn.sharedTopics,
            conn.sharedOrganizations
          );
        }
        setDeveloperConnectionsMap(connMap);
      })
      .catch(err => setError(err.message || 'Failed to load developer network.'))
      .finally(() => setLoading(false));
  }, [username]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleExpand = async () => {
    if (!selectedNode) return;
    
    // Determine the unique ID for the API
    const p = selectedNode.properties;
    const nodeId = 
      p.username as string || 
      p.normalizedName as string || 
      p.fullName as string || 
      p.login as string;

    if (!nodeId) return;

    setIsExpanding(true);
    try {
      const expansionData = await expandNode(selectedNode.type, nodeId, 1);
      setGraphData(prev => mergeGraphData(prev, expansionData));
    } catch (err: any) {
      // If there's an error expanding, you might want to show a toast.
      // For now, we just log or silently fail graph expansion gracefully.
      console.error("Failed to expand node", err);
    } finally {
      setIsExpanding(false);
    }
  };

  const selectedNodeDetails: NodeDetailsType | null = selectedNode ? {
    node: selectedNode,
    connectionReasons: selectedNode.type === 'Developer' 
      ? developerConnectionsMap[selectedNode.properties.username as string] 
      : undefined
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-56px)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Return home</Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Graph Area */}
      <div className="flex-1 relative h-full">
        <div className="absolute top-4 left-4 z-10">
          <Link 
            to={`/developers/${username}`} 
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm font-medium text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Profile
          </Link>
        </div>

        <GraphView 
          data={graphData} 
          selectedNodeId={selectedNode?.id || null} 
          onNodeClick={handleNodeClick} 
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-200 text-xs text-gray-600">
          <div className="font-bold text-gray-900 mb-2">Legend</div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> Developer</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div> Repository</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Technology</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div> Topic</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Organization</div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-full md:w-[360px] bg-white border-l border-gray-200 h-full flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 relative">
        <NodeDetails 
          details={selectedNodeDetails}
          onExpand={handleExpand}
          isExpanding={isExpanding}
          rootDeveloperUsername={username}
        />
      </div>
    </div>
  );
}
