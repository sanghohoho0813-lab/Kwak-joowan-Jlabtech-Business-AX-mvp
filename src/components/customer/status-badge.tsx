import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/data/types";

const tone: Record<RequestStatus, "info" | "warning" | "gold" | "success" | "neutral"> = {
  접수: "info",
  "검토 중": "warning",
  "일정·견적 제안": "gold",
  "처리 중": "warning",
  완료: "success",
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <Badge tone={tone[status]}>{status}</Badge>;
}
