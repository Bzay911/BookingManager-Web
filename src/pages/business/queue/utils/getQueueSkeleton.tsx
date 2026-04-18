import { Skeleton } from "../../../../components/ui/skeleton";

export default function QueueSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between px-6 py-4 border-b border-gray-50"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      ))}
    </>
  );
}