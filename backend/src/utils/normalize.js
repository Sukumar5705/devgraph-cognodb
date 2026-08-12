export function normalizeUsername(username) {
  if (!username) return '';
  return username.trim().toLowerCase();
}

export function normalizeName(name) {
  if (!name) return '';
  return name.trim().toLowerCase();
}

export function parsePath(neo4jPath) {
  if (!neo4jPath || !neo4jPath.segments) return null;

  const path = [];
  const relationships = [];

  const startNode = neo4jPath.start;
  path.push({
    type: startNode.labels[0],
    label: getNodeLabel(startNode),
    properties: startNode.properties
  });

  for (const segment of neo4jPath.segments) {
    relationships.push(segment.relationship.type);
    const endNode = segment.end;
    path.push({
      type: endNode.labels[0],
      label: getNodeLabel(endNode),
      properties: endNode.properties
    });
  }

  return { path, relationships, found: true };
}

export function parseNetwork(records) {
  const nodesMap = new Map();
  const edgesMap = new Map();

  const addNode = (node) => {
    if (!node) return;
    const id = node.elementId || node.identity?.toString();
    if (!nodesMap.has(id)) {
      nodesMap.set(id, {
        id,
        type: node.labels[0],
        label: getNodeLabel(node),
        properties: node.properties
      });
    }
  };

  const addEdge = (rel) => {
    if (!rel) return;
    const id = rel.elementId || rel.identity?.toString();
    if (!edgesMap.has(id)) {
      edgesMap.set(id, {
        id,
        source: rel.startNodeElementId || rel.start?.toString(),
        target: rel.endNodeElementId || rel.end?.toString(),
        relationship: rel.type
      });
    }
  };

  records.forEach(record => {
    record.keys.forEach(key => {
      const value = record.get(key);
      if (value) {
        if (value.labels) {
          addNode(value);
        } else if (value.type && value.startNodeElementId !== undefined) {
          addEdge(value);
        }
      }
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values())
  };
}

function getNodeLabel(node) {
  const p = node.properties;
  return p.username || p.name || p.fullName || p.login || p.normalizedName || 'Unknown';
}

export function toNumber(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  if (typeof val.toNumber === 'function') return val.toNumber();
  return Number(val);
}
