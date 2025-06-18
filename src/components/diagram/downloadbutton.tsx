import React from "react";
import {
  Panel,
  useReactFlow,
  getRectOfNodes,
  getTransformForBounds,
  Node,
} from "reactflow";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";

// Ajoutez le type de retour `void` pour indiquer que cette fonction ne retourne rien.
const downloadImage = (dataUrl: string): void => {
  const a = document.createElement("a");

  a.setAttribute("download", "taxonomy.png");
  a.setAttribute("href", dataUrl);
  a.click();
};

const imageWidth = 8192;
const imageHeight = 6144;

const DownloadButton: React.FC = () => {
  const { getNodes } = useReactFlow();
  const onClick = (): void => {
    // Les types pour `nodesBounds` et `transform` sont inférés automatiquement ici,
    // mais vous pouvez les définir explicitement si nécessaire pour plus de clarté.
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.25,
      8,
    );

    const element = document.querySelector(
      ".react-flow__viewport",
    ) as HTMLElement | null;
    if (element) {
      toPng(element, {
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        },
      })
        .then(downloadImage)
        .catch((error) => console.error("Could not download the image", error));
    }
  };

  return (
    <Panel position="top-right">
      <Button className="download-btn" onClick={onClick}>
        Download Image
      </Button>
    </Panel>
  );
};

export default DownloadButton;
