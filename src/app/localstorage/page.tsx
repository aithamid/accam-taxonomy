"use client";

import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState<number | null>(null);

  // Initialize count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("count");
    setCount(saved !== null ? parseInt(saved, 10) : 0);
  }, []);

  // Sync count to localStorage
  useEffect(() => {
    if (count !== null) {
      localStorage.setItem("count", count.toString());
    }
  }, [count]);

  const handleClick = () => {
    if (count !== null) setCount(count + 1);
  };

  return (
    <button onClick={handleClick}>
      Count: {count !== null ? count : <span>...</span>}
    </button>
  );
}
