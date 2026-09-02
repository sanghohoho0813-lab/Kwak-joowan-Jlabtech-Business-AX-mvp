import { cn } from "@/lib/utils";

/** 회사명 첫 글자 아바타 — 회사마다 색을 달리해 전환이 눈에 보이게 한다 */
const avatarTone: Record<string, string> = {
  "c-01": "bg-pine-700 text-white",
  "c-02": "bg-mist-600 text-white",
  "c-03": "bg-clay-600 text-white",
};

export function AccountAvatar({
  id,
  company,
  className,
}: {
  id: string;
  company: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl text-sm font-bold",
        avatarTone[id] ?? "bg-pine-700 text-white",
        className,
      )}
      aria-hidden
    >
      {company.slice(0, 1)}
    </span>
  );
}

