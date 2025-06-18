"use client";
import styles from "./Flow.module.css";

import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  CSSProperties,
} from "react";
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
  ControlButton,
  Controls,
  ReactFlowProvider,
  NodeTypes,
} from "reactflow";
import dagre from "dagre";

import "reactflow/dist/style.css";
import { L1 } from "@/interfaces/taxonomy";
import DownloadButton from "./downloadbutton";
import { toPng } from "html-to-image";
import { MyCustomNode } from "./CustomNode";

const nodeSize = {
  width: 100,
  height: 40,
};

const edgeType = "smoothstep";

// this example uses some v12 features that are not released yet
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "LR",
  nodeSpacing = 100,
  rankSpacing = 100,
): Node[] => {
  const isHorizontal = direction === "LR";
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  // Configurez le graphe avec un espacement personnalisé
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing, // Espacement entre les nœuds adjacents
    ranksep: rankSpacing, // Espacement entre les rangs
    marginx: 20, // Marge optionnelle autour du graphe en x
    marginy: 20, // Marge optionnelle autour du graphe en y
  });

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

export const Flow: React.FunctionComponent<{ n: Node[]; e: Edge[] }> = ({
  n,
  e,
}) => {
  const [nodes, setNodes] = useState<Node[]>(n);

  const nodeTypes = useMemo(
    () => ({
      custom: MyCustomNode,
    }),
    [],
  );

  useEffect(() => {
    // Appliquer le positionnement automatique lors du chargement initial des nœuds
    const layoutedNodes = getLayoutedElements(n, e);
    setNodes(layoutedNodes);
  }, [n, e]);

  return (
    <div className={styles.flow}>
      <ReactFlowProvider>
        <DownloadButton />
        <ReactFlow
          nodes={nodes}
          edges={e}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView={true}
          className="download-image"
          nodeTypes={nodeTypes}
          minZoom={0.01}
        >
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
