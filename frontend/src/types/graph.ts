// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Developer {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location?: string | null;
  company?: string | null;
  publicRepos?: number;
  followers?: number;
  profileUrl?: string;
}

export interface Repository {
  name: string;
  fullName: string;
  ownerUsername: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  isFork?: boolean;
}

export interface Technology {
  name: string;
  normalizedName: string;
  repoCount?: number;
  devCount?: number;
}

export interface Topic {
  name: string;
  normalizedName: string;
}

export interface Organization {
  login: string;
  name: string;
  url?: string;
}

// ─── Graph Visualization ──────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  type: 'Developer' | 'Repository' | 'Technology' | 'Topic' | 'Organization';
  label: string;
  properties: Record<string, unknown>;
  // react-force-graph fields (populated client-side)
  x?: number;
  y?: number;
  val?: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface DeveloperProfile {
  developer: Developer;
  repositories: Repository[];
  technologies: Technology[];
  topics: Topic[];
  organizations: Organization[];
}

export interface DeveloperConnection {
  username: string;
  name: string | null;
  avatarUrl: string;
  sharedTechnologies: string[];
  sharedTopics: string[];
  sharedOrganizations: string[];
  totalConnections: number;
  reasons: string[];
}

export interface PathNode {
  type: string;
  label: string;
  properties: Record<string, unknown>;
}

export interface ConnectionPath {
  found: boolean;
  path: PathNode[];
  relationships: string[];
  message?: string;
}

export interface TechnologyCommunity {
  technology: Technology;
  developers: Developer[];
  repositories: Repository[];
  relatedTechnologies: Technology[];
  topics: Topic[];
}

export interface NodeDetails {
  node: GraphNode;
  /** Human-readable reason this node is connected to the graph origin */
  connectionReasons?: string[];
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}
