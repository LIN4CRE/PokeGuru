interface SkeletonGridProps {
  count?: number;
}

export default function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="relative h-[280px] overflow-hidden rounded-[var(--radius)] bg-[var(--bg-card)] animate-shimmer"
        />
      ))}
    </div>
  );
}
