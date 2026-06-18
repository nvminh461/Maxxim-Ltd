"use client";

import { useState, type ReactNode } from "react";
import { moveItem } from "@/lib/utils";

export default function SortableList<T extends { id: string }>({
  items,
  onChange,
  renderItem,
  className = "",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          className="admin-sortable"
          draggable
          key={item.id}
          onDragEnd={() => setDragIndex(null)}
          onDragOver={(event) => event.preventDefault()}
          onDragStart={() => setDragIndex(index)}
          onDrop={() => {
            if (dragIndex === null || dragIndex === index) return;
            onChange(moveItem(items, dragIndex, index));
            setDragIndex(null);
          }}
        >
          <span aria-hidden="true" className="admin-drag-handle">
            ⋮⋮
          </span>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
