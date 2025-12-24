import type { ReactNode } from "react";

interface MasonryGridProps {
  children: ReactNode;
}

export function MasonryGrid({ children }: MasonryGridProps) {
  return (
    <div className="columns-1 md:columns-3 gap-4 [&>div]:break-inside-avoid [&>div]:mb-4 mt-4">
      {children}
    </div>
  );
}
