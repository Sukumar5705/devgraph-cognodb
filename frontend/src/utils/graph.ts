import type { GraphData, GraphEdge, GraphNode } from '../types/graph';

// Node type → display color (consistent across the whole app)
export const NODE_COLORS: Record<string, string> = {
  Developer: '#2563eb',    // blue-600
  Repository: '#4b5563',   // gray-600
  Technology: '#10b981',   // emerald-500
  Topic: '#8b5cf6',        // violet-500
  Organization: '#f59e0b', // amber-500
};

export function getNodeColor(type: string): string {
  return NODE_COLORS[type] ?? '#9ca3af';
}

/**
 * Merge incoming nodes/edges into an existing graph, deduplicating by id.
 */
export function mergeGraphData(existing: GraphData, incoming: GraphData): GraphData {
  const nodesMap = new Map<string, GraphNode>(existing.nodes.map(n => [n.id, n]));
  const edgesMap = new Map<string, GraphEdge>(existing.edges.map(e => [e.id, e]));

  for (const node of incoming.nodes) {
    if (!nodesMap.has(node.id)) {
      nodesMap.set(node.id, node);
    }
  }
  for (const edge of incoming.edges) {
    if (!edgesMap.has(edge.id)) {
      edgesMap.set(edge.id, edge);
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
  };
}

export function deduplicateNodes(nodes: GraphNode[]): GraphNode[] {
  const seen = new Set<string>();
  return nodes.filter(n => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
}

export function deduplicateEdges(edges: GraphEdge[]): GraphEdge[] {
  const seen = new Set<string>();
  return edges.filter(e => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

export function getNodeLabel(node: GraphNode): string {
  const p = node.properties as Record<string, unknown>;
  return (
    (p.username as string) ||
    (p.name as string) ||
    (p.fullName as string) ||
    (p.login as string) ||
    (p.normalizedName as string) ||
    node.label ||
    'Unknown'
  );
}

/**
 * Build a human-readable explanation of why two nodes are connected.
 * Used in the "Why connected?" panel.
 */
export function buildConnectionExplanation(
  sharedTechnologies: string[],
  sharedTopics: string[],
  sharedOrganizations: string[]
): string[] {
  const lines: string[] = [];
  if (sharedTechnologies.length > 0) {
    lines.push(`Shared technologies: ${sharedTechnologies.slice(0, 5).join(', ')}`);
  }
  if (sharedTopics.length > 0) {
    lines.push(`Shared topics: ${sharedTopics.slice(0, 5).join(', ')}`);
  }
  if (sharedOrganizations.length > 0) {
    lines.push(`Shared organizations: ${sharedOrganizations.slice(0, 3).join(', ')}`);
  }
  return lines;
}

/**
 * Convert react-force-graph's edge format (source/target can be string or node object)
 * back to plain string IDs so our Map lookups work.
 */
export function resolveEdgeId(val: string | { id: string }): string {
  return typeof val === 'string' ? val : val.id;
}
