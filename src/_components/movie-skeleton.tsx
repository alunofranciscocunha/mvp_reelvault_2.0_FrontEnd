import { Skeleton } from "./ui/skeleton";

export const MovieSkeleton = () => (
  <div className="animate-pulse">
    {/* Backdrop */}
    <Skeleton className="w-full h-[200px] md:h-[400px] rounded-xl" />

    <div className="px-5 md:px-32 space-y-6 ">
      {/* Poster + Infos */}
      <div className="flex gap-4 ">
        <Skeleton className="w-[120px] h-[180px] rounded-lg -translate-y-22" />
        <div className="flex flex-col gap-3 flex-1 py-2">
          <Skeleton className="w-3/4 h-5 rounded" />
          <Skeleton className="w-1/2 h-4 rounded" />
          <div className="flex gap-2">
            <Skeleton className="w-12 h-4 rounded" />
            <Skeleton className="w-10 h-4 rounded" />
            <Skeleton className="w-8 h-4 rounded" />
          </div>
        </div>
      </div>

      {/* Sinopse */}
      <div className="space-y-2">
        <Skeleton className="w-24 h-5 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-[90%] h-4 rounded" />
        <Skeleton className="w-[80%] h-4 rounded" />
      </div>

      {/* Botões */}
      <div className="flex flex-col md:flex-row gap-3">
        <Skeleton className="w-full h-10 rounded" />
        <Skeleton className="w-full h-10 rounded" />
        <Skeleton className="w-full h-10 rounded" />
      </div>
    </div>
  </div>
);
