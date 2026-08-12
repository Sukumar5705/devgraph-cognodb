import { useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { GraphData, GraphNode } from '../types/graph';
import { getNodeColor, getNodeLabel } from '../utils/graph';

interface GraphViewProps {
  data: GraphData;
  selectedNodeId: string | null;
  onNodeClick: (node: GraphNode) => void;
}

export function GraphView({ data, selectedNodeId, onNodeClick }: GraphViewProps) {
  const fgRef = useRef<any>(null);

  // Optional: zoom to fit on first data load
  useEffect(() => {
    if (data.nodes.length > 0 && fgRef.current) {
      setTimeout(() => {
        fgRef.current?.zoomToFit(400, 50);
      }, 500);
    }
  }, [data.nodes.length]);

  const drawNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = getNodeLabel(node);
      const isSelected = node.id === selectedNodeId;
      const fontSize = (isSelected ? 14 : 12) / globalScale;
      
      ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px Inter, sans-serif`;
      
      const radius = isSelected ? 7 : 5;
      
      ctx.fillStyle = getNodeColor(node.type);
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
      ctx.fill();

      // Highlight selected node with a stroke
      if (isSelected) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isSelected ? '#111827' : '#4b5563';
      ctx.fillText(label, node.x, node.y + radius + (8 / globalScale));
    },
    [selectedNodeId]
  );

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={{ nodes: data.nodes, links: data.edges } as any}
      nodeLabel={getNodeLabel}
      nodeColor={(node: any) => getNodeColor(node.type)}
      nodeCanvasObject={drawNode}
      linkColor={() => '#d1d5db'}
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      onNodeClick={onNodeClick as any}
      cooldownTicks={100}
    />
  );
}
