import { L1 } from "@/interfaces/taxonomy";
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
import { Flow } from "@/components/diagram/index";
import { off } from "process";

const edgeType = "smoothstep";

function convert(layer1: L1): [Node[], Edge[]] {
  const offColor = "#D6D5E6";
  let onColor = "#F9F871";
  if (layer1.name === "Digital infrastructure") {
    onColor = "#F87171";
  }
  let nodes: Node[] = [
    {
      id: layer1.id,
      data: { label: layer1.name },
      position: { x: 100, y: 100 },
      style: { background: onColor },
    },
  ];

  let edges: Edge[] = [];

  if (layer1.children) {
    layer1.children.forEach((layer2, index) => {
      let color = offColor;
      // Ajouter un nouveau nœud pour chaque enfant
      if (layer2.children) {
        layer2.children.forEach((layer3, index) => {
          if (layer3.active) {
            // Ajouter un nouveau nœud pour chaque enfant
            nodes.push({
              id: layer3.id, // En supposant que layer2 a un id
              data: { label: layer3.name }, // En supposant que layer2 a un nom
              position: { x: 150 + index * 100, y: 400 }, // Positionnement exemple, ajustez selon les besoins
            });

            // Ajouter un nouvel edge pour chaque enfant
            edges.push({
              id: layer2.id + "-" + layer3.id, // Création d'un ID unique pour l'edge
              source: layer2.id, // ID du nœud source
              target: layer3.id, // ID du nœud cible
              // type: edgeType, // Assurez-vous que `edgeType` est défini quelque part dans votre code
              animated: true,
            });
            color = onColor;
            if (layer3.input) {
              let name = layer3.id + "input";

              nodes.push({
                id: name, // En supposant que layer2 a un id
                type: "custom",
                data: { input: layer3.input }, // En supposant que layer2 a un nom
                position: { x: 0, y: 0 }, // Positionnement exemple, ajustez selon les besoins
              });

              // Ajouter un nouvel edge pour chaque enfant
              edges.push({
                id: layer3.id + "-" + name, // Création d'un ID unique pour l'edge
                source: layer3.id, // ID du nœud source
                target: name, // ID du nœud cible
                // type: edgeType, // Assurez-vous que `edgeType` est défini quelque part dans votre code
                animated: true,
              });
            }
            if (layer3.children) {
              layer3.children.forEach((layer4, index) => {
                if (layer4.active) {
                  // Ajouter un nouveau nœud pour chaque enfant
                  nodes.push({
                    id: layer4.id, // En supposant que layer2 a un id
                    data: { label: layer4.name }, // En supposant que layer2 a un nom
                    position: { x: 150 + index * 100, y: 400 }, // Positionnement exemple, ajustez selon les besoins
                  });

                  // Ajouter un nouvel edge pour chaque enfant
                  edges.push({
                    id: layer3.id + "-" + layer4.id, // Création d'un ID unique pour l'edge
                    source: layer3.id, // ID du nœud source
                    target: layer4.id, // ID du nœud cible
                    // type: edgeType, // Assurez-vous que `edgeType` est défini quelque part dans votre code
                    animated: true,
                  });
                  if (layer4.input) {
                    const name = layer4.id + "input";

                    nodes.push({
                      id: name, // En supposant que layer2 a un id
                      type: "custom",
                      data: { input: layer4.input }, // En supposant que layer2 a un nom
                      position: { x: 0, y: 0 }, // Positionnement exemple, ajustez selon les besoins
                    });

                    // Ajouter un nouvel edge pour chaque enfant
                    edges.push({
                      id: layer4.id + "-" + name, // Création d'un ID unique pour l'edge
                      source: layer4.id, // ID du nœud source
                      target: name, // ID du nœud cible
                      // type: edgeType, // Assurez-vous que `edgeType` est défini quelque part dans votre code
                      animated: true,
                    });
                  }
                }
                if (layer3.input) {
                  const name = layer3.id + "input";

                  nodes.push({
                    id: name, // En supposant que layer2 a un id
                    type: "custom",
                    data: { input: layer3.input }, // En supposant que layer2 a un nom
                    position: { x: 0, y: 0 }, // Positionnement exemple, ajustez selon les besoins
                  });

                  // Ajouter un nouvel edge pour chaque enfant
                  edges.push({
                    id: layer3.id + "-" + name, // Création d'un ID unique pour l'edge
                    source: layer3.id, // ID du nœud source
                    target: name, // ID du nœud cible
                    // type: edgeType, // Assurez-vous que `edgeType` est défini quelque part dans votre code
                    animated: true,
                  });
                }
              });
            }
          }
        });
      } else if (layer2.input) {
        if (
          (layer2.input.multi_choice?.value ?? []).length > 0 ||
          layer2.input.newClass?.some((item) => item.active) ||
          (layer2.input.one_choice?.value !== "" &&
            layer2.input.one_choice?.value !== undefined) ||
          (layer2.input.double !== "" && layer2.input.double !== undefined) ||
          (layer2.input.text !== "" && layer2.input.text !== undefined) ||
          (layer2.input.specialClass?.some((item) => item.active) ?? false)
        ) {
          color = onColor;
        }
        let name = layer2.id + "input";

        nodes.push({
          id: name, // En supposant que layer2 a un id
          type: "custom",
          data: { input: layer2.input }, // En supposant que layer2 a un nom
          position: { x: 0, y: 0 }, // Positionnement exemple, ajustez selon les besoins
        });

        // Ajouter un nouvel edge pour chaque enfant
        edges.push({
          id: layer2.id + "-" + name, // Création d'un ID unique pour l'edge
          source: layer2.id, // ID du nœud source
          target: name, // ID du nœud cible
          // type: edgeType, // Assurez-vous que `edgeType` est défini quelque part dans votre code
          animated: true,
        });
      }
      nodes.push({
        id: layer2.id, // En supposant que layer2 a un id
        data: { label: layer2.name }, // En supposant que layer2 a un nom
        position: { x: 100 + index * 100, y: 200 }, // Positionnement exemple, ajustez selon les besoins
        style: { background: color },
      });

      // Ajouter un nouvel edge pour chaque enfant
      edges.push({
        id: layer1.id + "-" + layer2.id, // Création d'un ID unique pour l'edge
        source: layer1.id, // ID du nœud source
        target: layer2.id, // ID du nœud cible
        // type: edgeType, // Assurez-vous que `edgeType` est défini quelque part dans votre code
        animated: true,
      });
    });
  }

  return [nodes, edges];
}

export const DataHandler: React.FunctionComponent<{ layer1: L1 }> = ({
  layer1,
}) => {
  let [nodes, edges]: [Node[], Edge[]] = convert(layer1);
  return (
    <div>
      <Flow e={edges} n={nodes} />
    </div>
  );
};

export const GlobalView: React.FunctionComponent<{ layers: L1[] }> = ({
  layers,
}) => {
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  layers.forEach((layer1) => {
    let [n, e]: [Node[], Edge[]] = convert(layer1);
    nodes = nodes.concat(n);
    edges = edges.concat(e);
  });
  return (
    <div>
      <Flow e={edges} n={nodes} />
    </div>
  );
};
