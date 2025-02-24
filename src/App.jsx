import { useState, useEffect } from "react";

const getRandomPosition = () => {
  const padding = 100;
  return {
    x: padding + Math.random() * (window.innerWidth - padding * 2),
    y: padding + Math.random() * (window.innerHeight - padding * 2),
  };
};

function Block({ id, position, onAdd, parentPosition, onPositionUpdate }) {
  const [pos, setPos] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newPos = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        };
        setPos(newPos);
        onPositionUpdate(id, newPos);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, id, onPositionUpdate]);

  return (
    <>
      {parentPosition && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <path
            d={`M ${parentPosition.x + 50} ${parentPosition.y + 100}
                L ${parentPosition.x + 50} ${
              (parentPosition.y + pos.y + 150) / 2
            }
                L ${pos.x + 50} ${(parentPosition.y + pos.y + 150) / 2}
                L ${pos.x + 50} ${pos.y}`}
            stroke="black"
            strokeDasharray="5,5"
            fill="none"
          />
        </svg>
      )}

      <div
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width: "100px",
          height: "100px",
          backgroundColor: "#ff0066",
          cursor: isDragging ? "grabbing" : "grab",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          zIndex: 1,
        }}
        onMouseDown={handleMouseDown}
      >
        <div>{id}</div>
        <button
          onClick={() => onAdd(id, pos)}
          style={{
            padding: "2px 30px",
            margin: "5px",
            cursor: "pointer",
            backgroundColor: "pink",
          }}
        >
          +
        </button>
      </div>
    </>
  );
}

function App() {
  const [blocks, setBlocks] = useState([
    { id: 0, position: getRandomPosition(), parentId: null },
  ]);

  const handleAddBlock = (parentId) => {
    const newBlock = {
      id: blocks.length,
      position: getRandomPosition(),
      parentId,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handlePositionUpdate = (id, newPosition) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, position: newPosition } : block
      )
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {blocks.map((block) => (
        <Block
          key={block.id}
          id={block.id}
          position={block.position}
          onAdd={handleAddBlock}
          onPositionUpdate={handlePositionUpdate}
          parentPosition={
            block.parentId !== null
              ? blocks.find((b) => b.id === block.parentId)?.position
              : null
          }
        />
      ))}
    </div>
  );
}

export default App;
