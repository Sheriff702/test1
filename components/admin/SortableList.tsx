"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type SortableItem = { id: string };

export function SortableList<T extends SortableItem>({
  items,
  onChange,
  renderItem,
  emptyLabel = "Nothing to sort yet.",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, dragHandleProps: DragHandleProps) => React.ReactNode;
  emptyLabel?: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    onChange(arrayMove(items, oldIdx, newIdx));
  };

  if (items.length === 0) {
    return <p className="text-cream/40 text-sm">{emptyLabel}</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <SortableRow key={item.id} id={item.id}>
              {(handleProps) => renderItem(item, index, handleProps)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

export type DragHandleProps = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
  isDragging: boolean;
};

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (handleProps: DragHandleProps) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 10 : "auto",
  } as React.CSSProperties;

  return (
    <li ref={setNodeRef} style={style}>
      {children({ attributes, listeners, isDragging })}
    </li>
  );
}

export function DragHandle({ handle }: { handle: DragHandleProps }) {
  return (
    <button
      type="button"
      {...handle.attributes}
      {...handle.listeners}
      className="cursor-grab active:cursor-grabbing select-none text-cream/40 hover:text-mares font-mono text-base px-1 touch-none"
      aria-label="Drag to reorder"
    >
      ⋮⋮
    </button>
  );
}

/** Reusable sortable list of plain strings (renamed: nice when each "item" has no other props). */
export function SortableStringList({
  values,
  onChange,
  placeholder = "Empty",
  renderControls,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  renderControls?: (value: string, index: number, set: (next: string) => void) => React.ReactNode;
}) {
  // Stable IDs: index-tagged so duplicates don't collide
  const [keys] = useState<string[]>(() => values.map((_, i) => `k-${i}-${Math.random().toString(36).slice(2, 8)}`));
  const items = values.map((v, i) => ({ id: keys[i] ?? `k-${i}`, value: v }));
  const setAt = (i: number, next: string) => {
    const arr = [...values];
    arr[i] = next;
    onChange(arr);
  };
  return (
    <SortableList
      items={items}
      onChange={(next) => onChange(next.map((n) => n.value))}
      emptyLabel={placeholder}
      renderItem={(it, i, handle) => (
        <div className="flex items-center gap-2 bg-ink border border-cream/15 rounded-md p-2">
          <DragHandle handle={handle} />
          {renderControls ? renderControls(it.value, i, (n) => setAt(i, n)) : (
            <input
              value={it.value}
              onChange={(e) => setAt(i, e.target.value)}
              className="flex-1 bg-transparent outline-none font-mono text-xs"
            />
          )}
        </div>
      )}
    />
  );
}
