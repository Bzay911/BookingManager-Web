import { formatDistance } from "date-fns";

export default function waitTimeAgo(joinedAt: string, currentTime: number) {
  return formatDistance(new Date(joinedAt), new Date(currentTime), {
    addSuffix: true,
  });
}