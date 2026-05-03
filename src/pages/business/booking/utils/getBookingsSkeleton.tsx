import { Skeleton } from "../../../../components/ui/skeleton";
import {
  TableCell,
  TableRow,
} from "../../../../components/ui/table";


export default function TableLoadingSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i} className="border-gray-50 hover:bg-transparent">
          <TableCell className="py-4 pl-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-14" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-14 rounded-full" />
          </TableCell>
          <TableCell className="text-right pr-6">
            <Skeleton className="h-7 w-7 rounded-lg ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}