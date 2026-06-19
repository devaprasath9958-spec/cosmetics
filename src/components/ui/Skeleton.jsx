import React from "react";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-obsidian-border dark:bg-obsidian-border rounded-md ${className}`}
    ></div>
  );
}
