"use client";

import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  ConnectionLineType,
  Position,
  MiniMap,
} from "reactflow";
import dagre from "dagre";

import "reactflow/dist/style.css";

const nodeSize = {
  width: 100,
  height: 40,
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB",
): Node[] => {
  const isHorizontal = direction === "LR";
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeSize.width,
      height: nodeSize.height,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeSize.width / 2,
        y: nodeWithPosition.y - nodeSize.height / 2,
      },
    };
  });
};

export default function Flow({
  nodes: initNodes,
  edges: initEdges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initEdges);

  useEffect(() => {
    // Appliquer le positionnement automatique lors du chargement initial des nœuds
    const layoutedNodes = getLayoutedElements(initNodes, initEdges);
    setNodes(layoutedNodes);
  }, [initNodes, initEdges]);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
  }, []);

  const onConnect: OnConnect = useCallback((params) => {
    setEdges((eds) =>
      addEdge(
        { ...params, type: ConnectionLineType.SmoothStep, animated: true },
        eds,
      ),
    );
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={true}
      >
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
}
