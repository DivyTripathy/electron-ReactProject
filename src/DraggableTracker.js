import { useEffect, useState } from "react";
import { remote } from "electron";

const DraggableTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const { screen } = remote;
    const currentScreen = screen.getDisaplayNearestPoint(
      screen.getCursorScreenPoint()
    );
    const { width, height } = currentScreen.bounds;

    let x = e.screenX;
    let y = e.screenY;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > width) x = width;
    if (y > height) y = height;

    setPosition({ x, y });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        cursor: isDragging ? "grabbing" : "grab"
      }}
      onMouseDown={handleMouseDown}
    ></div>
  );
};

export default DraggableTracker();
